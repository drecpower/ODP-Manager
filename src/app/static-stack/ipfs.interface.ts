export interface IIpfs {
    create(config:IIpfsConfig);
}

export interface IIpfsConfig {
    repo?: string,
    pubsub?: boolean,
    EXPERIMENTAL?: {
        pubsub?: any
    }
    , config?: {
        Addresses?: {
            Swarm?: string[]
        }
    }

}