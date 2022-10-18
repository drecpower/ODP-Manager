import { DtoStoredOrder } from "../../services/integrator/dto-stored-order";

/* tslint:disable */
export interface DtoOrderStatus {
    storedOrder?: DtoStoredOrder;
    alert?:any;
    processing?:boolean;
  }