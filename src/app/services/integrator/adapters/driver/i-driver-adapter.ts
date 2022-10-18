import { Observable } from "rxjs";
import { DtoEvent, DtoOrderDetails } from "src/app/api/models";
import { DtoStoredOrder } from "../../dto-stored-order";

/* tslint:disable */
export interface IDriverAdapter {
    name:string;
    sourceName:string;
    onNewEvents:Observable<DtoEvent[]>;
    acknowledge(events:DtoEvent[]):void;
    doPooling():void;
    requestDriver(order : DtoStoredOrder):void;
  }