import Enumerable from "linq";
import { OptionGroupProduct, Product } from "src/app/api/models";
import { SSOrbitdb } from "../orbitdb";
import { IFakeRestController } from "./IFakeController.interface";

export class ProductFakeController implements IFakeRestController<Product> {

    name: string = "Product";
    constructor() {
    }


    async getAll(): Promise<Product[]> {
        var products: Product[] = [];
        var productsIndex = {};
        let itemsDb: any = await SSOrbitdb.GetDocInstance("Item");
        let items = itemsDb.get('');
        for (let item of items) {
            if (item.productIdNavigation) {
                if (!productsIndex[item.productIdNavigation.id]) {
                    productsIndex[item.productIdNavigation.id] = item.productIdNavigation;
                    products.push(item.productIdNavigation);
                }
            }
        }
        return products;
    }
    async get(uuid: any): Promise<Product> {
        var product: Product = null;
        let productsDb: any = await SSOrbitdb.GetDocInstance("Product");
        let opProductsDb: any = await SSOrbitdb.GetDocInstance("OptionGroupProduct");
        let products : Product[] = productsDb.get(uuid);
        if(products.length > 0){
            products[0].optionGroupProduct = opProductsDb.query((doc: OptionGroupProduct)=> doc.productId == uuid);
            product = products[0];
        }    
        return product;
    }
    async query(propertyName: any, search: any): Promise<Product[]> {
        var products = Enumerable.from(await this.getAll()).where(x => x[propertyName] == search).toArray();
        return products;
    }
    async post(payload: Product): Promise<Product> {
        let productDb: any = await SSOrbitdb.GetDocInstance("Product");
        var hash = await productDb.put(payload, { pin: true });
        return payload;
        // throw new Error("Method not implemented.");
    }

    async delete(uuid: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

}