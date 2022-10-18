import { DtoOrderDetails, DtoEvent } from "src/app/api/models";

/* tslint:disable */
export interface DtoStoredEvent {
    event: DtoEvent;
    id:string;
    adapter:string;
    source:string;
  }