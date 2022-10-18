import { DtoOrderStatus } from "src/app/shared/order/dto-order-status";

/* tslint:disable */
export interface DtoOrderStatusGroup {
    dtoOrderStatus?: Array<DtoOrderStatus>;
    qtd?: number;
    status?: string;
  }