import { DtoOrderDetails, DtoEvent } from "src/app/api/models";

/* tslint:disable */
export interface DtoStoredOrder {
    order?: DtoOrderDetails;
    status:string;
    modifiedAt:Date;
    source?:string;
    adapter:string;
    events:DtoEvent[];
    id:string;
    processingStatus?:string;
    processingStatusAt?:Date;
    driver?:{
        workerPhone:string,
        workerVehicleType:string,
        workerName:string,
        workerExternalUuid:string,
        workerPhotoUrl:string,
        status:string
    },
    pickupAreaAssigned?:{
      PICKUP_AREA_CODE:string,
      PICKUP_AREA_TYPE:string
    },
    consumerRequestCancellation?:boolean;
    instruction?:{label:string,icon:string};

  }