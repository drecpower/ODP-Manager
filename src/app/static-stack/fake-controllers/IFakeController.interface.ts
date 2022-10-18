export interface IFakeRestController<T> {
    name:string
    getAll():Promise<T[]>;
    get(uuid:any):Promise<T>;
    delete(uuid:any):Promise<void>;
    query(propertyName:any,search:any):Promise<T[]>;
    post(payload:T):Promise<T>;
}