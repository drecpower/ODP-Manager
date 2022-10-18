import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Catalog, Merchant } from 'src/app/api/models';
import { CatalogService, MerchantService } from 'src/app/api/services';
import { ImgService } from 'src/app/services/img.service';
import { SystemService } from 'src/app/services/system.service';
import { SSIpfs } from 'src/app/static-stack/ipfs';
import { SSOrbitdb } from 'src/app/static-stack/orbitdb';
import { SSUuid } from 'src/app/static-stack/uuid';
import { CryptoService } from "src/app/services/crypto.service";

@Component({
  selector: 'app-wizard-new-merchant',
  templateUrl: './wizard-new-merchant.component.html',
  styleUrls: ['./wizard-new-merchant.component.less']
})
export class WizardNewMerchantComponent implements OnInit {

  constructor(
    public httpClient: HttpClient,
    public domSanitizer: DomSanitizer,
    public imgSvc: ImgService,
    public merchantSvc: MerchantService,
    public catalogSvc: CatalogService,
    public systemSvc: SystemService,
    public cryptoSvc:CryptoService,
    public router: Router
  ) { }

  channelOptions=["Create new P2P Channel","Use custom P2P Channel","Use custom OpenDeliveryApi"];
  selectedOptChannel=this.channelOptions[0];
  showMoreOptions=false;

  public formMerchant = {
    name: "",
    streetAddress: "",
    phone: "",
    email: "",
    delinetendpoint: ""
  };

  imgLogo = null;

  ngOnInit(): void {
    if (this.systemSvc.selectedMerchantGroup == null) {
      this.router.navigate(["/choose-merchant-group"]);
    }
    if (this.systemSvc.selectedMerchantGroup?.pwaManifest) {
      var pwaman = JSON.parse(this.systemSvc.selectedMerchantGroup.pwaManifest);
      if (pwaman && pwaman.app_icon_ipfs) {
        this.imgSvc.getBlobUrlFromHashAsync(pwaman.app_icon_ipfs).then(
          (d) => {
            this.imgLogo = d
          }
        )
      }
    }
  }


  public static async createNewDelinetChannel(merchant:Merchant,channelName="open-delivery-platform") {
    let cry=CryptoService.Instance;
    let sysSvc=SystemService.Instance;
    var _ipfsNode = await SSIpfs.getNode();
    var scriptElm = await SSOrbitdb.GetOrbitDbInstance(_ipfsNode);
    var newLogChannel: any = await SSOrbitdb.GetLogInstancePool(merchant.id+"_"+channelName);
    var delinetEndpoint = newLogChannel.id;
    var keys=await cry.generateNewKeys();
    
    merchant.delinetEndpoint=delinetEndpoint;
    merchant.delinetPublicKey=keys.publicKey;
    merchant.delinetPrivateKey=keys.privateKey;

    try {
      var settingsData= JSON.parse(JSON.stringify(sysSvc.localSettings));
      settingsData["Orders Endpoints"].Endpoints.push({
        name:'P2P OpenDeliveryPlatform',
        type:'delinet',
        sourceName:'odp',
        endpoint:delinetEndpoint,
        clientId: "",
        clientSecret: "",
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
      });
      console.log("updating settings...");
      sysSvc.localSettings=settingsData;
    } catch (error) {
      console.log(error);
    }


    return merchant;
  }

  async register() {
    var newMerchantRegister: Merchant = {
      id: SSUuid.GenerateV4(),
      name: this.formMerchant.name,
      delinetEndpoint: this.formMerchant.delinetendpoint,
      delinetPublicKey: "",
      delinetPrivateKey: "",
      merchantGroupId:this.systemSvc.selectedMerchantGroup.id,
      acceptDeliveryOrder:true,
      acceptScheduledOrder:true,
      acceptTableOrder:true,
      acceptTakeoutOrder:true
    };

    if (this.selectedOptChannel==this.channelOptions[0]){
      newMerchantRegister=await WizardNewMerchantComponent.createNewDelinetChannel(newMerchantRegister);

    };

    this.merchantSvc.postApiMerchant(newMerchantRegister).subscribe(
      (newMerchantResponse) => {
        if (newMerchantResponse) {
          var newCatalog: Catalog = {
            id: SSUuid.GenerateV4(),
            status: 'ACTIVE',
            type: 'DELIVERY',
            merchantId: newMerchantResponse.id,
            merchantIdNavigation: newMerchantResponse,
            category: []
          };

          this.catalogSvc.postApiCatalog(newCatalog).subscribe(
            (catalogResponse) => {
              this.systemSvc.selectedMerchant = newMerchantResponse;
              this.router.navigate(["/help"]);
            }
          );
        }
      },
      (e) => {
        alert(e);
      }
    )
  }

}
