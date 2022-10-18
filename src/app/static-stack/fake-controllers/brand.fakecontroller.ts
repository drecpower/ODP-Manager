import Enumerable from "linq";
import { Catalog, Category, DtoBrand, OptionGroup } from "src/app/api/models";
import { SystemService } from "src/app/services/system.service";
import { SSOrbitdb } from "../orbitdb";
import { IFakeRestController } from "./IFakeController.interface";
import { ProductFakeController } from "./product.fakecontroller";

export class BrandFakeController implements IFakeRestController<DtoBrand> {

    name: string = "Brand";
    constructor() {
    }


    async getAll(): Promise<DtoBrand[]> {
        throw new Error("Method not implemented.");
    }
    async get(uuid: any): Promise<DtoBrand> {
        var merchantGroup = SystemService.Instance.selectedMerchantGroup
        var ret = <DtoBrand>{
            id: merchantGroup.id,
            adminMode: merchantGroup.adminMode,
            status: "AVAILABLE",
            createdAt: merchantGroup.createdAt,
            name: merchantGroup.name,
            ordersEndpoint: "",
            product: await (new ProductFakeController()).query("merchantGroupId", merchantGroup.id),
            merchant: ((<any>await SSOrbitdb.GetDocInstance("Merchant")).get(''))
        }
        var allCatalogs = <Catalog[]>(<any>await SSOrbitdb.GetDocInstance("Catalog")).get('');
        var allCategories = <Category[]>(<any>await SSOrbitdb.GetDocInstance("Category")).get('');
        var allOptionGroups = <OptionGroup[]>(<any>await SSOrbitdb.GetDocInstance("OptionGroup")).get('');
        for (var merchant of ret.merchant) {
            merchant.catalog = Enumerable.from(allCatalogs)
                .where(x => x.merchantId == merchant.id)
                .select(x => {
                    x.category = Enumerable.from(allCategories).where(cat => cat.catalogId == x.id).toArray();
                    return x
                })
                .toArray();

            merchant.optionGroup = Enumerable.from(allOptionGroups)
                .where(x => x.merchantId == merchant.id)
                .toArray();
        }

        return ret;
    }
    async query(propertyName: any, search: any): Promise<DtoBrand[]> {
        var products = Enumerable.from(await this.getAll()).where(x => x[propertyName] == search).toArray();
        return products;
    }
    async post(payload: DtoBrand): Promise<DtoBrand> {
        throw new Error("Method not implemented.");
    }

    async delete(uuid: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

}