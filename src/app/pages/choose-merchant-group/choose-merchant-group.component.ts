import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HashData, Merchant, MerchantGroup } from 'src/app/api/models';
import { CatalogService, CategoryService, HashDataService, MerchantGroupService, MerchantService } from 'src/app/api/services';
import { ImgService } from 'src/app/services/img.service';
import { SystemService } from 'src/app/services/system.service';
import { SSLoadLib } from 'src/app/static-stack/loadlib';
import { SSWeb3 } from 'src/app/static-stack/web3';
import { PublishComponent } from "src/app/pages/publish/publish.component";
import Enumerable from 'linq';
import { SSIpfs } from 'src/app/static-stack/ipfs';
import { WizardNewMerchantComponent } from '../wizards/wizard-new-merchant/wizard-new-merchant.component';
import { SSUuid } from 'src/app/static-stack/uuid';

@Component({
  selector: 'app-choose-merchant-group',
  templateUrl: './choose-merchant-group.component.html',
  styleUrls: ['./choose-merchant-group.component.less']
})
export class ChooseMerchantGroupComponent implements OnInit {

  public MerchantGroupList: MerchantGroup[] = [];

  constructor(
    //Injections
    public systemSvc: SystemService,
    public merchantGroupSvc: MerchantGroupService,
    public merchantSvc: MerchantService,
    public catalogSvc: CatalogService,
    public categorySvc: CategoryService,
    public hashDataSvc:HashDataService,
    public router: Router,
    public imgSvc: ImgService
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    
    this.merchantGroupSvc.getApiMerchantGroup({}).subscribe(
      (d) => {
        this.MerchantGroupList = d;
        this.loadFromWeb3();
        d.forEach(mgrp => {
          this.getAppIconUrl(mgrp).then(
            (d) => {
              mgrp["appicon"] = d;
            }
          )
        });
      },
      (e) => {
        console.log(e);
      }
    )
  }

  _web3: any = null;
  isWrongNetwork = false;
  async web3() {
    if (!this._web3) {
      var web3HTMLElement = await SSLoadLib.loadJSLib("web3lib", "libs/web3.min.js");
      var w3 = new window['Web3'](window['Web3'].givenProvider || "ws://localhost:8545");
      this._web3 = w3;
      this.checkNetwork();
    }
    return this._web3;
  }

  async checkNetwork() {
    SSWeb3.checkChainNetwork(
      () => {
        document.location.reload();
      },
      () => {
        this.isWrongNetwork = true;
      });
  }

  selectedIpfsGateway = "";
  getIpfsGWLink(cid) {
    return (this.selectedIpfsGateway) + "ipfs/" + cid;
  }

  getIpfsGWLinkView(cid) {
    return "ipfs://" + cid;
  }

  gettingFromWeb3 = false;

  async loadFromWeb3() {
    if (this.systemSvc.isStaticAppOnly) {
      this.gettingFromWeb3=true;
      if (!this.selectedIpfsGateway) {
        this.selectedIpfsGateway = PublishComponent.ipfsW3GWList.split(";")[0];
        let stgGateway = (localStorage.getItem("publish_current_ipfs_gateway"));
        if (stgGateway) {
          this.selectedIpfsGateway = stgGateway;
        }
      }
      console.log(this.selectedIpfsGateway);
      let web3 = await this.web3();
      var odpStoreContract = new web3.eth.Contract(PublishComponent.odpStoreNamesContractAbi, PublishComponent.odpStoreNamesContractAddress);
      var web3Accounts = await web3.eth.requestAccounts();
      var account_totalTokens = parseInt(await odpStoreContract.methods.balanceOf(web3Accounts[0]).call());
      console.log("TOTAL TOKENS MINTED " + web3Accounts[0] + ": " + account_totalTokens);
      var _added:boolean=false;
      for (let index = 0; index < account_totalTokens; index++) {
        let element = parseInt(await odpStoreContract.methods.tokenOfOwnerByIndex(web3Accounts[0], index).call());
        let tokenUri = (await odpStoreContract.methods.tokenURI(element).call());
        let codename= (await odpStoreContract.methods.tokenId_to_codeName(element).call());
        let ipfsHash = tokenUri.replace("ipfs://", '');
        let jsonMetaData = (await (await fetch(this.selectedIpfsGateway + "ipfs/" + ipfsHash)).json())
        try {
          let ipfsApp = jsonMetaData.external_url.split("ipfs/")[1];
          let appData = (await (await fetch(jsonMetaData.external_url + "/manifest.webmanifest")).json());
          let appIcon = (await (await fetch(jsonMetaData.external_url + "/assets/icons/app-icon.png")).blob());
          var _cidIpfs = await SSIpfs.addFile(appIcon);
          appData.app_icon_ipfs = _cidIpfs.cid.toString();
          this.selectedIpfsGateway = jsonMetaData.external_url.split("ipfs/")[0];
          let endpointHashdata: any = Enumerable.from(<{ protocolType?: string, type?: string }[]>appData.endpoints).where(p => p.protocolType == "IPFS" && p.type == "DATA").defaultIfEmpty(undefined).firstOrDefault();
          let hashData = endpointHashdata.publicKey;
          let merchantGroup = (await (await fetch(this.selectedIpfsGateway + "ipfs/" + hashData + "/" + appData.merchantGroupId + ".json")).json());

          let inMemoryMerchantGroup = Enumerable.from(this.MerchantGroupList).where(p => p.id == merchantGroup.id).defaultIfEmpty(undefined).firstOrDefault();
          if (!inMemoryMerchantGroup) {
            _added=true;
            merchantGroup.pwaManifest = JSON.stringify(appData);
            let added = await this.merchantGroupSvc.postApiMerchantGroup(merchantGroup).toPromise();
            let hashp:HashData={}
            if (merchantGroup.createdAt){
              hashp.createdAt=merchantGroup.createdAt;
            } else {
              hashp.createdAt=(new Date()).toISOString();
              merchantGroup.createdAt=hashp.createdAt;
            };
            hashp.hash=hashData;
            hashp.hashApp=ipfsApp;
            hashp.hashPackage=ipfsApp;
            hashp.id=SSUuid.GenerateV4();
            hashp.merchantGroupId=merchantGroup.id;
            hashp.odpName=codename;
            var hashOdpName = await this.hashDataSvc.postApiHashDataResponse(hashp).toPromise();

            for (let index = 0; index < merchantGroup.merchant.length; index++) {
              let merchant: Merchant = merchantGroup.merchant[index];
              console.log("Merchant before:");
              console.log(merchant);
              delete merchant.delinetEndpoint
              delete merchant.delinetPrivateKey
              delete merchant.delinetPublicKey
              let nmerchant=await WizardNewMerchantComponent.createNewDelinetChannel(merchant,SSUuid.GenerateV4()+"_open-delivery-platform");
              console.log("Merchant after:");
              console.log(nmerchant);
              let added = await this.merchantSvc.postApiMerchant(merchant).toPromise();
              console.log(merchant);
              for (let indexCatalog = 0; indexCatalog < merchant.catalog.length; indexCatalog++) {
                const _catalog = merchant.catalog[indexCatalog];
                let added = await this.catalogSvc.postApiCatalog(_catalog).toPromise();
                for (let indexCategory = 0; indexCategory < _catalog.category.length; indexCategory++) {
                  const _category = _catalog.category[indexCategory];
                  let added = await this.categorySvc.postApiCategory(_category).toPromise();
                }
              }
            }

            console.log("TOKEN INDEX: " + index + " -> ID: " + element);
            console.log("TOKEN URI: " + tokenUri);
          }

        } catch (error) {

        }

      }
      this.gettingFromWeb3 = false;      
      if (_added) {
        this.initialize();
      } else {
        if (this.MerchantGroupList.length==0){
          this.router.navigate(["/wizard-new-merchant-group"]);    
        }
      }
    } else {
      this.router.navigate(["/wizard-new-merchant-group"]);
    }
  }

  createNewMerchantGroup() {
    this.router.navigate(["/wizard-new-merchant-group"]);
  }

  async getAppIconUrl(mgrp: MerchantGroup) {
    if (mgrp.pwaManifest) {
      let pwa = JSON.parse(mgrp.pwaManifest);
      if (pwa.app_icon_ipfs) {
        try {
          return await this.imgSvc.getBlobUrlFromHashAsync(pwa.app_icon_ipfs);
        } catch (error) {
        }
      } else {
        return "assets/imgs/logo.png";
      }

    } else {
      return "assets/imgs/logo.png";
    }

  }

  selectMerchantGroup(mgrp: MerchantGroup) {
    this.systemSvc.selectedMerchantGroup = mgrp;
    this.router.navigate(["/choose-merchant"]);
  }

}
