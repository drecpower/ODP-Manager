export interface IOrbitDb {
    createInstance(ipfsnode:any, config?:IOrbitDbConfig);
}

export interface IOrbitDbConfig { identity: any }