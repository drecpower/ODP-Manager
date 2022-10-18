import Enumerable from "linq";
import { OptionGroup } from "src/app/api/models";
import { SSOrbitdb } from "../orbitdb";
import { IFakeRestController } from "./IFakeController.interface";

export class OptionGroupFakeController implements IFakeRestController<OptionGroup> {

    name: string = "OptionGroup";
    constructor() {
    }


    async getAll(): Promise<OptionGroup[]> {
        throw new Error("Method not implemented.");
    }
    async get(uuid: any): Promise<OptionGroup> {
        var optionGroup: OptionGroup = null;
        let optionGroupDb: any = await SSOrbitdb.GetDocInstance("OptionGroup");
        let optionGroups : OptionGroup[] = optionGroupDb.get(uuid);
        if(optionGroups.length > 0){
            optionGroup = optionGroups[0];
        }
        return optionGroup;
    }
    async query(propertyName: any, search: any): Promise<OptionGroup[]> {
        throw new Error("Method not implemented.");
    }
    async post(payload: OptionGroup): Promise<OptionGroup> {
        let optionGroupDb: any = await SSOrbitdb.GetDocInstance("OptionGroup");
        var hash = await optionGroupDb.put(payload, { pin: true });
        let opProductsDb: any = await SSOrbitdb.GetDocInstance("OptionGroupProduct");

        if (payload.optionGroupProduct) {
            for (let ogp of payload.optionGroupProduct) {
                ogp.optionGroupId = payload.id;
                var ogpHash = await opProductsDb.put(ogp, { pin: true });
            }
        }

        return payload;
        // throw new Error("Method not implemented.");
    }

    async delete(uuid: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
}