import { Observable } from "rxjs";
import { DtoEvent, DtoOrderDetails } from "src/app/api/models";

/* tslint:disable */
export interface IOrderAdapter {
    name:string;
    sourceName:string;
    onNewEvents:Observable<DtoEvent[]>;
    acknowledge(events:DtoEvent[]):void;
    doPooling():void;
    getOrder(id:string):Promise<DtoOrderDetails>;
    changeStatus(id:string,code:string):Promise<boolean>;
  }