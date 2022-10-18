import { HttpClient, HttpHandler, HttpRequest, HttpXhrBackend } from "@angular/common/http";
import { resolve } from "dns";
import Enumerable from "linq";
import { Subject } from "rxjs";
import { ApiConfiguration } from "src/app/api/api-configuration";
import { DtoEvent, DtoOrderDetails } from "src/app/api/models";
import { OrderService } from "src/app/api/services/order.service";
import { IOrderAdapter } from "../i-order-adapter";

export class OAdWebApi implements IOrderAdapter {
    private static _instance: OAdWebApi;

    constructor(config: DtoAdapterConfig) {
        this.name = config.name;
        this.sourceName = config.sourceName;
        this.endpoint=config.endpoint;

        this.initialize();
    }
    public name: string;
    public sourceName: string;
    public endpoint:string;

    private _onNewEventsSubject = new Subject<DtoEvent[]>();
    public onNewEvents = this._onNewEventsSubject.asObservable();

    public promisses: { id: string, resolve: any }[] = [];
    private orderSvc: OrderService;
    private async initialize() {
        var config = new ApiConfiguration();
        config.rootUrl = this.endpoint;
        const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
        this.orderSvc = new OrderService(config, httpClient);
    }
    private async poolingLoopRoutine() {
        try {
            let _eventsArray = await this.orderSvc.getApiOrderV10EventsPooling({ Types: "", Groups: "" }).toPromise();
            this._onNewEventsSubject.next(_eventsArray);
        } catch (error) {
            var a = error;
        }
    }
    public async acknowledge(events: DtoEvent[]) {
        let _ackList = Enumerable.from(events).select(p => p.id).toArray();
        if (_ackList.length > 0) {
            let ackRet = await this.orderSvc.postApiOrderV10EventsAcknowledgment(_ackList).toPromise();
        }
    }

    public doPooling(): void {
        this.poolingLoopRoutine();
       
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

}
