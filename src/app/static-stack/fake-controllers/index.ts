import { BrandFakeController } from "./brand.fakecontroller";
import { IFakeRestController } from "./IFakeController.interface";
import { OptionGroupFakeController } from "./optionGroup.fakecontroller";
import { ProductFakeController } from "./product.fakecontroller";

export const fakeRestControllers:IFakeRestController<any>[] = [
    new ProductFakeController(),
    new OptionGroupFakeController(),
    new BrandFakeController()
];

export const getFakeRestControllerByName=function <T> (name: string): IFakeRestController<T> {
    return fakeRestControllers.find(c => c.name === name);
}