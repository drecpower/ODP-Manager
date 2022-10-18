import { HttpClient, HttpHandler, HttpRequest, HttpXhrBackend } from "@angular/common/http";
import Enumerable from "linq";
import { Subject } from "rxjs";
import { ApiConfiguration } from "src/app/api/api-configuration";
import { DtoEvent, DtoOrderDetails } from "src/app/api/models";
import { OrderService } from "src/app/api/services/order.service";
import { IOrderAdapter } from "../i-order-adapter";
import { DtoDelinetEvent } from './dto-delinet-event';
import { DelinetClient } from "src/app/services/integrator/adapters/order/delinet/delinet-client";
import { SystemService } from '../../../../system.service';
import { resolve } from "dns";
import { _DB } from "src/app/shared/integrator-db";
import { SSUuid } from "src/app/static-stack/uuid";
import { CryptoService } from "src/app/services/crypto.service";


export class OAdDelinetChannel implements IOrderAdapter {
    private static _instance: OAdDelinetChannel;

    constructor(config: DtoAdapterConfig) {
        this.name = config.name;
        this.sourceName = config.sourceName;
        this.delinetEndpoint=config.endpoint;
        this.publicKey=config.publicKey;
        this.privateKey=config.privateKey;
        this.initialize();
    }
    public name: string;
    public sourceName: string;
    public delinetEndpoint:string;
    public publicKey:string;
    public privateKey:string;

    private _onNewEventsSubject = new Subject<DtoEvent[]>();
    public onNewEvents = this._onNewEventsSubject.asObservable();
    private _onReadyAdapterSubject = new Subject<boolean>();
    public onReadyAdapter = this._onReadyAdapterSubject.asObservable();

    private _swarms = [
        '/dns4/intense-lake-89842.herokuapp.com/tcp/443/wss/p2p-webrtc-star/'
    ];

    private _isRunning = false;
    private delinetClient: DelinetClient
    private orderSvc: OrderService;
    private systemSvc:SystemService;

    private async initialize() {
        this.systemSvc=SystemService.Instance;
        
        var config = new ApiConfiguration();
        config.rootUrl = '';
        const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
        this.orderSvc = new OrderService(config, httpClient);

        this.delinetClient = new DelinetClient();
        this.delinetClient.onEventReceived.subscribe(
            (evt) => {
                if (evt && evt.payload){
                    if (evt.eventType=="order"){
                        _DB.localorders.put(evt.payload,evt.payload.id);
                    } else {
                        this._onNewEventsSubject.next([evt.payload]);
                    }
                }
            }
        )
        setInterval(
            async () => {
                if (!this._isRunning) {
                    await this.mainLoopRoutine();
                }
            }, 5000
        )
    }

    async mainLoopRoutine() {
        this._isRunning = true;
        try {
          if (this.systemSvc.selectedMerchant
            && this.delinetEndpoint
            //&&false
            //&& this.systemSvc.selectedMerchant.delinetPublicKey
            //&& this.systemSvc.selectedMerchant.delinetPrivateKey
          ) {
            if (this.systemSvc.selectedMerchant.delinetEndpoint != this.delinetClient.endpoint) {
              this.delinetClient.endpoint=this.delinetEndpoint;
              this.delinetClient.publicKey=this.publicKey;
              this.delinetClient.privateKey=this.privateKey;
            }
          } else {
            //TODO: Stop client
          }
        } catch (error) {
    
        }
        this._isRunning = false;
      }

    public async acknowledge(events: DtoEvent[]) {
        events.forEach(_event => {
            this.delinetClient.sendAckToEvent(_event.id);    
        });
    }

    public start() {

    }
    public stop() {

    }

    public async getOrder(id: string): Promise<DtoOrderDetails> {
        let _orderDetail = await _DB.localorders.get(id);
        return _orderDetail as any;
    }
    public async changeStatus(orderId: string, code: string): Promise<boolean>  {
        let ret = false;
        try {
          switch (code) {
            case "confirm":
              //await this.orderSvc.postApiOrderV10IdConfirm(orderId).toPromise();
              var newsuid=SSUuid.GenerateV4();
              var newEvt=<DtoDelinetEvent>{
                eventType:"event",
                payload:{
                  code: "CFM",
                  createdAt: (new Date()).toISOString(),
                  fullCode: "CONFIRMED",
                  id: newsuid,
                  metadata: null,
                  orderId: orderId
                },
                id:newsuid
            };

            await this.delinetClient.sendEvent(newEvt);
              setTimeout(() => {
                 //newEvt.id=this.name+"_"+newEvt.id;
                this._onNewEventsSubject.next([newEvt.payload]);
                
              }, 500);
              
              ret = true;
              break;
            case "startPreparation":
              //await this.orderSvc.postApiOrderV10IdStartPreparation(orderId).toPromise();
              ret = true;
              break;
            case "readyToPickup":
              //await this.orderSvc.postApiOrderV10IdReadyToPickup(orderId).toPromise();
              ret = true;
              break;
            case "dispatch":
              //await this.orderSvc.postApiOrderV10IdDispatch(orderId).toPromise();
              ret = true;
              break;
            case "requestCancellation":
              //await this.orderSvc.postApiOrderV10IdRequestCancellation(orderId).toPromise();
              ret = true;
              break;
            case "acceptCancellation":
              //await this.orderSvc.postApiOrderV10IdAcceptCancellation(orderId).toPromise();
              ret = true;
              break;
            case "denyCancellation":
              //await this.orderSvc.postApiOrderV10IdDenyCancellation(orderId).toPromise();
              ret = true;
              break;
    
            default:
              break;
          }
        } catch (error) {
    
        }

        return ret;
    }

    doPooling(): void {
    }
    
}
