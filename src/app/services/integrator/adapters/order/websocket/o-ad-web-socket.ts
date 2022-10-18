import { HttpClient, HttpHandler, HttpRequest, HttpXhrBackend } from "@angular/common/http";
import Enumerable from "linq";
import { Subject } from "rxjs";
import { ApiConfiguration } from "src/app/api/api-configuration";
import { DtoEvent, DtoOrderDetails } from "src/app/api/models";
import { OrderService } from "src/app/api/services/order.service";
import { IOrderAdapter } from "../i-order-adapter";
import { SystemService } from '../../../../system.service';
import { webSocket } from "rxjs/webSocket";


export class OAdWebSocket implements IOrderAdapter {

  constructor(config: DtoAdapterConfig) {
    this.name = config.name;
    this.sourceName = config.sourceName;
    this.endpoint = config.endpoint;
    this.initialize();
  }
  public name: string;
  public sourceName: string;
  endpoint: string;

  private _onNewEventsSubject = new Subject<DtoEvent[]>();
  public onNewEvents = this._onNewEventsSubject.asObservable();
  private _onReadyAdapterSubject = new Subject<boolean>();
  public onReadyAdapter = this._onReadyAdapterSubject.asObservable();

  private _swarms = [
    '/dns4/intense-lake-89842.herokuapp.com/tcp/443/wss/p2p-webrtc-star/'
  ];

  private _isRunning = false;
  private orderSvc: OrderService;
  private systemSvc: SystemService;

  private async initialize() {
    var config = new ApiConfiguration();
    config.rootUrl = this.endpoint;
    const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
    this.orderSvc = new OrderService(config, httpClient);

    var scheme = document.location.protocol === "https:" ? "wss" : "ws";
    var port = document.location.port ? (":" + document.location.port) : "";

    var ws = config.rootUrl ? webSocket(config.rootUrl.replace("https", "wss").replace("http", "ws") + "/ws/client") : webSocket(scheme + "://" + document.location.hostname + port + "/ws/client");
    ws.subscribe(
      (d) => {
        try {
          if (d) {
            console.log(d);
            this._onNewEventsSubject.next([d]);
          }
        } catch (error) {

        }
      }
    )
  }



  public async acknowledge(events: DtoEvent[]) {
    let _ackList = Enumerable.from(events).select(p => p.id).toArray();
    if (_ackList.length > 0) {
      let ackRet = await this.orderSvc.postApiOrderV10EventsAcknowledgment(_ackList).toPromise();
    }
  }

  public async getOrder(id: string): Promise<DtoOrderDetails> {
    let _orderDetail = await this.orderSvc.getApiOrderV10Id(id).toPromise();
    return _orderDetail;
  }
  public async changeStatus(orderId: string, code: string): Promise<boolean> {
    let ret = false;
    try {
      switch (code) {
        case "confirm":
          await this.orderSvc.postApiOrderV10IdConfirm(orderId).toPromise();
          ret = true;
          break;
        case "startPreparation":
          await this.orderSvc.postApiOrderV10IdStartPreparation(orderId).toPromise();
          ret = true;
          break;
        case "readyToPickup":
          await this.orderSvc.postApiOrderV10IdReadyToPickup(orderId).toPromise();
          ret = true;
          break;
        case "dispatch":
          await this.orderSvc.postApiOrderV10IdDispatch(orderId).toPromise();
          ret = true;
          break;
        case "requestCancellation":
          await this.orderSvc.postApiOrderV10IdRequestCancellation(orderId).toPromise();
          ret = true;
          break;
        case "acceptCancellation":
          await this.orderSvc.postApiOrderV10IdAcceptCancellation(orderId).toPromise();
          ret = true;
          break;
        case "denyCancellation":
          await this.orderSvc.postApiOrderV10IdDenyCancellation(orderId).toPromise();
          ret = true;
          break;

        default:
          break;
      }
    } catch (error) {

    }
    return ret;
  }
  public doPooling(): void {

  }

}
