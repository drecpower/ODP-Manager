import Dexie, {Table} from "dexie";
import { DtoEvent, DtoOrderDetails, Order } from "../api/models";
import { DtoStoredEvent } from "../services/integrator/dto-stored-event";
import { DtoStoredOrder } from "../services/integrator/dto-stored-order";

export class IntegratorDb extends Dexie {
    tempEvents!: Table<DtoStoredEvent,string>;
    events!: Table<DtoStoredEvent,string>;
    orders!: Table<DtoStoredOrder,string>;
    localorders!: Table<Order,string>;

    constructor(){
        super('integratordb');
        this.version(3).stores({
            events:'id',
            orders:'id',
            tempEvents:'id',
            localorders:'id'
        })
    }
}
export const _DB=new IntegratorDb();