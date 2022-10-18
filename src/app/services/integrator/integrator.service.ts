import { DtoOrderStatusGroup } from '../../shared/order/dto-order-status-group';
import { DtoEvent } from '../../api/models/dto-event';
import { ItemService, OrderService } from 'src/app/api/services';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as Enumerable from 'linq';
import { _DB } from '../../shared/integrator-db';
import { DtoStoredOrder } from './dto-stored-order';
import { IOrderAdapter } from './adapters/order/i-order-adapter';
import { OAdWebApi } from './adapters/order/webapi/o-ad-web-api';
import { DtoStoredEvent } from './dto-stored-event';
import { SSUuid } from 'src/app/static-stack/uuid';
import { OAdWebSocket } from './adapters/order/websocket/o-ad-web-socket';
import { SystemService } from '../system.service';
import { OAdDelinetChannel } from './adapters/order/delinet/o-ad-delinet';

@Injectable({
  providedIn: 'root'
})
export class IntegratorService {
  private _processedEvents: any = {};

  listPooling: DtoEvent[] = [];
  listOrder: DtoStoredOrder[] = [];

  initialized=false;
  private _onInitialized = new Subject<boolean>();
  public onInitialized = this._onInitialized.asObservable();

  private _onOrdersListUpdatedSubject = new Subject<DtoStoredOrder[]>();
  public onOrdersListUpdated = this._onOrdersListUpdatedSubject.asObservable();

  private _onOrdersListLoadedSubject = new Subject<DtoStoredOrder[]>();
  public onOrdersListLoaded = this._onOrdersListLoadedSubject.asObservable();

  private _onAddedOrderSubject = new Subject<DtoStoredOrder>();
  public onAddedOrder = this._onAddedOrderSubject.asObservable();

  private _onUpdatedOrderSubject = new Subject<DtoStoredOrder>();
  public onUpdatedOrder = this._onUpdatedOrderSubject.asObservable();

  private _onDeletedOrderSubject = new Subject<DtoStoredOrder>();
  public onDeletedOrder = this._onDeletedOrderSubject.asObservable();

  private _onEventFromPoolSubject = new Subject<DtoStoredEvent>();
  public onEventFromPool = this._onEventFromPoolSubject.asObservable();

  private _countDownPooling = new Subject<number>();
  public countDownPoolingAsync = this._countDownPooling.asObservable();

  private _progressToNextPooling = new Subject<number>();
  public progressToNextPooling = this._progressToNextPooling.asObservable();

  private _OnErrorSubject = new Subject<any>();
  public OnError = this._OnErrorSubject.asObservable();

  public listOrderStatusGroup: DtoOrderStatusGroup[] = [];

  public isRunningPooling = false;
  public isRunningProcessEvent = false;
  public isWaitingToProcessEvent = false;
  public isPoolingLoopRoutineActive = false;
  public poolingDelaySeconds = 30;
  public secondsElapsedFromLastPooling = 999999;
  public promisses: { storedOrderid: string, resolve: any }[] = [];
  public activeAdapters: IOrderAdapter[] = [];
  selectedMerchantPost=false;
  constructor(private orderSvc: OrderService, private systemSvc: SystemService, public itemSvc: ItemService) {
    systemSvc.isSystemReadyAsync.subscribe(d => {
      if (this.systemSvc.selectedMerchant) {
        this.initialize();
      } else {
        systemSvc.selectedMerchantChanged.subscribe(d2 => {
          if (d2 && !this.selectedMerchantPost) {
            this.selectedMerchantPost=true;
            this.initialize();
          }
        })
      }

    });

  }

  private async initialize() {

    await _DB.open();
    this.listOrder = await _DB.orders.toArray();
    this._onOrdersListLoadedSubject.next(this.listOrder);
    if (this.listOrder.length > 0) {
      this._onOrdersListUpdatedSubject.next(this.listOrder);
    }

    var config: DtoAdapterConfig[] = this.systemSvc.localSettings["Orders Endpoints"].Endpoints;
    for (let i = 0; i < config.length; i++) {
      const element = config[i];
      console.log("Init adapter: " + element.name);
      var adapter: IOrderAdapter;
      switch (config[i].type) {
        case "webapi":
          adapter = new OAdWebApi(config[i]);
          this.activeAdapters.push(adapter);
          break;
        case "websocket":
          adapter = new OAdWebSocket(config[i]);
          this.activeAdapters.push(adapter);
          break;
        case "delinet":
          adapter = new OAdDelinetChannel(config[i]);
          this.activeAdapters.push(adapter);
          break;

        default:
          break;
      }
      adapter.onNewEvents.subscribe(
        async (_events) => {
          for (let index = 0; index < _events.length; index++) {
            try {
              var newGuid = adapter.name + "_" + _events[index].id;
              var dto: DtoStoredEvent = {
                adapter: adapter.name, event: _events[index], id: newGuid,
                source: adapter.sourceName
              };

              await _DB.tempEvents.add(dto, dto.id);
            } catch (e) {
              var a = e;
            }
          }
          await adapter.acknowledge(_events);
          await this.processEvent();
        }
      );
    }

    setInterval(async () => {
      if (
        this.isPoolingLoopRoutineActive
        && this.secondsElapsedFromLastPooling > this.poolingDelaySeconds
        && !this.isRunningPooling
      ) {
        (await this.doPooling());
      }
      if (this.isPoolingLoopRoutineActive) {
        (this.secondsElapsedFromLastPooling += 0.2);
        let countDown = this.poolingDelaySeconds - this.secondsElapsedFromLastPooling;
        if (countDown < 0) countDown = 0;
        this._countDownPooling.next(Math.floor(countDown));
        var percent = ((this.poolingDelaySeconds - countDown) / this.poolingDelaySeconds) * 100;
        this._progressToNextPooling.next(percent);
      }

    }, 200);

    this.initialized=true;
    this._onInitialized.next(true);
  }
  public async doPooling() {
    this.secondsElapsedFromLastPooling = 0;
    for (let i = 0; i < this.activeAdapters.length; i++) {
      await this.activeAdapters[i].doPooling();
    }
  }

  public startPooling(poolingDelaySeconds: number = 0) {
    if (this.poolingDelaySeconds > 0) {
      this.poolingDelaySeconds = this.poolingDelaySeconds;
    }
    this.isPoolingLoopRoutineActive = true;
  }

  public stopPooling() {
    this.isPoolingLoopRoutineActive = false;
  }

  async processEvent() {
    if (!this.isRunningProcessEvent) {
      this.isRunningProcessEvent = true
      try {
        var _storedEvents = await _DB.tempEvents.toArray();
        for (let i = 0; i < _storedEvents.length; i++) {
          const _storedEvent: DtoStoredEvent = _storedEvents[i];
          var adapter = this.getAdapter(_storedEvent.adapter);
          if (adapter != null) {
            this._onEventFromPoolSubject.next(_storedEvent);
            var dbpEvent = await _DB.events.get(_storedEvent.id);
            if (!dbpEvent) {
              await _DB.events.put(_storedEvent, _storedEvent.id);
              var _localStoredOrder = Enumerable.from(this.listOrder).where(o => o.order.id == _storedEvent.event.orderId && o.source == adapter.sourceName).defaultIfEmpty(null).firstOrDefault();
              var idx = this.listOrder.indexOf(_localStoredOrder);

              if (_storedEvent.event.code) {
                try {
                  switch (_storedEvent.event.code) {
                    case "PLC":
                    case "RPS":
                      let _orderDetail = await adapter.getOrder(_storedEvent.event.orderId);
                      var newUuid = SSUuid.GenerateV4();
                      var dto = <DtoStoredOrder>{ order: _orderDetail, status: _storedEvent.event.code, modifiedAt: new Date(), events: [_storedEvent.event], id: newUuid, source: adapter.sourceName, adapter: adapter.name };
                      if (_localStoredOrder == null) {
                        this.listOrder.push(dto);
                        this._onAddedOrderSubject.next(dto);
                      } else {
                        _localStoredOrder.status = _storedEvent.event.code;
                        this.updateOrderEvent(_localStoredOrder, _storedEvent.event);
                        this._onUpdatedOrderSubject.next(_localStoredOrder);
                      }
                      await _DB.orders.put(dto, dto.id);
                      this._onOrdersListUpdatedSubject.next(this.listOrder);
                      break;
                    case "CFM":
                    case "RTP":
                    case "DSP":
                    case "CON":
                      if (_localStoredOrder != null) {
                        _localStoredOrder.status = _storedEvent.event.code;
                        this.updateOrderEvent(_localStoredOrder, _storedEvent.event);
                        await this.persistEventChanges(_localStoredOrder);
                      }
                      break;
                    case "ADR":
                      if (_localStoredOrder != null) {
                        this.updateOrderEvent(_localStoredOrder, _storedEvent.event);
                        try {
                          if (_storedEvent.event.metadata != null) {
                            var obj = JSON.parse(_storedEvent.event.metadata);
                            try {
                              if (typeof obj == 'string') {
                                obj = JSON.parse(obj);
                              }
                            } catch (error) {

                            }
                            _localStoredOrder.driver = {
                              workerExternalUuid: obj.workerExternalUuid,
                              workerName: obj.workerName,
                              workerPhone: obj.workerPhone,
                              workerPhotoUrl: obj.workerPhotoUrl,
                              workerVehicleType: obj.workerVehicleType,
                              status: "accepted the request"
                            }
                          }
                        } catch (error) {

                        }
                        await this.persistEventChanges(_localStoredOrder);
                      }
                      break;
                    case "GTO":
                    case "AAO":
                    case "CLT":
                    case "AAD":
                      if (_localStoredOrder != null) {
                        this.updateOrderEvent(_localStoredOrder, _storedEvent.event);
                        var dicDriver = { GTO: "going to store", AAO: "arrived at store", CLT: "collected order", AAD: "arrived at destination" };
                        try {
                          _localStoredOrder.driver.status = dicDriver[_storedEvent.event.code];
                        } catch (error) {

                        }
                        await this.persistEventChanges(_localStoredOrder);
                      }
                      break;
                    case "CCR":
                      if (_localStoredOrder != null) {
                        _localStoredOrder.consumerRequestCancellation = true;
                        this.updateOrderEvent(_localStoredOrder, _storedEvent.event);
                        await this.persistEventChanges(_localStoredOrder);
                      }
                      break;
                    case "CCA":
                    case "CCD":
                      if (_localStoredOrder != null) {
                        _localStoredOrder.consumerRequestCancellation = false;
                        this.updateOrderEvent(_localStoredOrder, _storedEvent.event);
                        await this.persistEventChanges(_localStoredOrder);
                      }
                      break;
                    default:
                      break;
                  }
                  await _DB.tempEvents.delete(_storedEvent.id);
                } catch (error) {
                  this._OnErrorSubject.next(error);
                  console.log("Error processing " + _storedEvent.event.code + " Event");
                  console.log(error);
                }
              }

            }
          }
        }
      } catch (error) {

      }
      this.isRunningProcessEvent = false;
      if (this.isWaitingToProcessEvent) {
        this.isWaitingToProcessEvent = false;
        setTimeout(() => {
          this.processEvent();
        }, 1);
      }
    } else {
      this.isWaitingToProcessEvent = true;
    }
  }
  updateOrderEvent(_localStoredOrder: DtoStoredOrder, _event: DtoEvent) {
    _localStoredOrder.modifiedAt = new Date();
    _localStoredOrder.processingStatus = undefined;
    _localStoredOrder.processingStatusAt = undefined;
    if (_localStoredOrder.events.length > 0) {
      _localStoredOrder.events.push(_event);
    }
  }
  private async persistEventChanges(_localStoredOrder: DtoStoredOrder) {
    this._onUpdatedOrderSubject.next(_localStoredOrder);
    await _DB.orders.put(_localStoredOrder, _localStoredOrder.id);
    this._onOrdersListUpdatedSubject.next(this.listOrder);
    try {
      var p = Enumerable.from(this.promisses).where(x => x.storedOrderid == _localStoredOrder.id).firstOrDefault();
      if (p != null) {
        p.resolve();
      }
    } catch (error) {
    }
  }

  changeStatus(storedOrderId: string, status: string) {
    var p = new Promise<any>(
      async (resolve, reject) => {
        var _localOrderDetail = Enumerable.from(this.listOrder).where(o => o.id == storedOrderId).defaultIfEmpty(null).firstOrDefault();
        _localOrderDetail.processingStatus = status;
        _localOrderDetail.processingStatusAt = new Date();
        var adapter = this.getAdapter(_localOrderDetail.adapter);
        if (adapter != null) {
          let changedStatus = await adapter.changeStatus(_localOrderDetail.order.id, status);
          if (changedStatus) {
            this.promisses.push({ storedOrderid: storedOrderId, resolve: resolve });

            this._onUpdatedOrderSubject.next(_localOrderDetail);
            await _DB.orders.put(_localOrderDetail, storedOrderId);
            this._onOrdersListUpdatedSubject.next(this.listOrder);
          }
          else {
            reject();
          }
        }
        else {
          reject();
        }
      }
    );
    return p;
  }
  getAdapter(name: string) {
    var adapter = Enumerable.from(this.activeAdapters).where(x => x.name == name).firstOrDefault();
    if (adapter == null) {

    }
    return adapter;
  }
}
