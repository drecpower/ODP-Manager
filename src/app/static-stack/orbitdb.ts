import { HttpHandler, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { DtoOauthRequest } from "src/app/api/models";
import { CryptoService } from "src/app/services/crypto.service";
import * as JSZip from 'jszip';

import Dexie from "dexie";
import { importDB, exportDB, importInto, peakImportFile } from "dexie-export-import";
import { downloadUtil } from "../shared/download-util";
import { ethers, providers } from "ethers";
import { EthIdentityProvider } from "./eth-identity-provider";
import { resolve } from "dns";
import { provideRoutes } from "@angular/router";
import { SSLoadLib } from "./loadlib";
import { SSAuthentication } from "./authentication";


export class SSOrbitdb {
    public static active: boolean = false;
    public static _instance: any = null;
    public static GetOrbitDbInstance(ipfsnode): Promise<any> {
        return new Promise<any>(
            async (resolve, reject) => {
                var orbitdbScriptElement = await SSLoadLib.loadJSLib("orbitdblib", "libs/orbitdb.min.js");
                if (this._instance == null) {
                    let _identity = await SSOrbitdb.GetEthWalletIdentity();
                    (window as any).OrbitDB.createInstance(ipfsnode, { identity: _identity }).then((_odb: any) => {
                        this._instance = _odb;
                        this.active = true;
                        resolve(this._instance);
                    });
                } else {
                    resolve(this._instance);
                }
            }
        );
    }
    public static docsInstances: any = {};
    public static docsPoolInstances: any = {};
    public static logInstances: any = {};

    public static GetDocInstance(dbName: string, preLoad: boolean = true) {
        return new Promise(
            async (resolve, reject) => {
                if (this._instance == null) {
                    reject("Orbitdb instance not found");
                } else {
                    if (this.docsInstances[dbName] == undefined) {
                        this.docsInstances[dbName] = await this._instance.docs(dbName, { indexBy: 'id' });
                        if (preLoad) await this.docsInstances[dbName].load();
                        resolve(this.docsInstances[dbName]);
                    } else {
                        resolve(this.docsInstances[dbName]);
                    }
                }
            }
        )
    }

    public static GetLogInstancePool(dbName: string, preLoad: boolean = true) {
        return new Promise(
            async (resolve, reject) => {
                if (this._instance == null) {
                    reject("Orbitdb instance not found");
                } else {
                    if (this.docsPoolInstances[dbName] == undefined) {
                        this.docsPoolInstances[dbName] = await this._instance.log(dbName, {
                            indexBy: 'id',
                            accessController: {
                                write: ['*']
                            }
                        });
                        if (preLoad) await this.docsPoolInstances[dbName].load();
                        resolve(this.docsPoolInstances[dbName]);
                    } else {
                        resolve(this.docsPoolInstances[dbName]);
                    }
                }
            }
        )
    }

    public static GetLogInstance(dbName: string, preLoad: boolean = false) {
        return new Promise(
            async (resolve, reject) => {
                if (this._instance == null) {
                    reject("Orbitdb instance not found");
                } else {
                    if (this.logInstances[dbName] == undefined) {
                        this.logInstances[dbName] = await this._instance.log(dbName);
                        if (preLoad) await this.logInstances[dbName].load();
                        resolve(this.logInstances[dbName]);
                    } else {
                        resolve(this.logInstances[dbName]);
                    }
                }
            }
        )
    }

    public static async ExportDatabases(_identity = null, _odbInstance = null) {
        const odb = _odbInstance || SSOrbitdb._instance;
        const identity = _identity || odb.identity
        if (odb != null) {
            var _idb = odb.keystore._store.db.db.db;
            var _dbList = await (indexedDB as any).databases();
            var zip = new JSZip();
            var zipdir = zip.folder("admin_data");
            for (let i = 0; i < _dbList.length; i++) {
                const _db = _dbList[i];
                var _indb = await this.GetIDB(_db.name);
                var dbBlob = new Dexie(_db.name);
                let { verno, tables } = await dbBlob.open();
                var dbkp = await exportDB(dbBlob);
                zipdir.file(_db.name.replaceAll("/", "___"), dbkp);
            }
            var zipblob = await zipdir.generateAsync({ type: "blob" });

            downloadUtil.initiateDownloadDataFromBrowser(zipblob, "admin_bkp.zip", zipblob.type);
        }
    }

    public static GetIDB(dbName: string) {
        return new Promise<any>((resolve, reject) => {
            const _indb: any = indexedDB.open(dbName);
            _indb.onsuccess = (indb: IDBRequest<IDBDatabase>, ev: Event) => {
                resolve(_indb.result);
            }

        });
    }


    public static async GetEthWalletIdentity(_identity = null, _odbInstance = null) {

        try {
            await SSLoadLib.loadJSLib("orbitdblib", "libs/orbitdb.min.js");
            console.log('ethereum.enable()');
            try {
                (await (window as any).ethereum.enable());
            } catch (err){}
            
            (window as any).OrbitDB.Identities.addIdentityProvider(EthIdentityProvider);
            const provider = (window as any).ethereum ? (new ethers.providers.Web3Provider((window as any).ethereum)) : new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/",);
            console.log('provider: ');
            console.log(provider);

            
            
            var accounts = await provider.listAccounts();
            console.log(accounts)
            var wallet = (window as any).ethereum ? provider.getSigner() :ethers.Wallet.createRandom();
            //(wallet as any).provider=provider;
            
            // You can also use an ENS name for the contract address
const daiAddress = "0xd2aCe07FFD3939abc31bA618909B01Ef2B0a8e23";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const daiAbi = [
  // Some details about the token
  "function name() view returns (string)",
  "function symbol() view returns (string)",

  // Get the account balance
  "function balanceOf(address) view returns (uint)",

  // Send some of your tokens to someone else
  "function transfer(address to, uint amount)",

  // An event triggered whenever anyone transfers to someone else
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

// The Contract object
const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
// Get the ERC-20 token name
console.log(await daiContract.name());
// 'Dai Stablecoin'

// Get the ERC-20 token symbol (for tickers and UIs)
console.log(await daiContract.symbol());
// 'DAI'

// Get the balance of an address
var balance = await daiContract.balanceOf("0x405D17B98f34F553af2A7B3a773B7d518ec09a50")
// { BigNumber: "8501797437309328201631" }
console.log(balance);

// Format the DAI for displaying to the user
ethers.utils.formatUnits(balance, 18)


            console.log(wallet);
            const identity = await (window as any).OrbitDB.Identities.createIdentity(
                {
                    type: "ethereum",
                    wallet
                }
            );
            sessionStorage.setItem("odb_identity", JSON.stringify(identity));
            return identity;
        } catch (error) {
            console.log(error);
            return null;
        }

    }


}

