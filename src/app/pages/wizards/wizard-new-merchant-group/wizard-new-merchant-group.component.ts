import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { map, timeout } from 'rxjs/operators';
import { UploadUtil } from 'src/app/shared/upload-util';
import { MffUploadFileComponent } from "src/app/components/mat-form-field/mff-upload-file/mff-upload-file.component";
import { DomSanitizer } from '@angular/platform-browser';
import { ImgService } from 'src/app/services/img.service';
import { MerchantGroupService } from 'src/app/api/services';
import { MerchantGroup } from 'src/app/api/models';
import { SSUuid } from 'src/app/static-stack/uuid';
import { SystemService } from 'src/app/services/system.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wizard-new-merchant-group',
  templateUrl: './wizard-new-merchant-group.component.html',
  styleUrls: ['./wizard-new-merchant-group.component.less']
})
export class WizardNewMerchantGroupComponent implements OnInit {

  constructor(
    public httpClient:HttpClient,
    public domSanitizer:DomSanitizer,
    public imgSvc:ImgService,
    public merchantGroupSvc:MerchantGroupService,
    public systemSvc:SystemService,
    public router:Router
  ) { }

  ngOnInit(): void {
  }

  public formMerchantGroup={
    name:"",
    appName:"",
    appShortName:"",
    appIcon:""
  };
  

  public uploadedIcon:any=null;

  async onUploadIcon(metadata){
    this.uploadedIcon=this.imgSvc.getBlobUrlFromHashAsync(metadata.ipfsHash);
    this.formMerchantGroup.appIcon=metadata.ipfsHash;
  }

  async register(){
    var jsonpwa=JSON.stringify({
      name:this.formMerchantGroup.appName,
      short_name:this.formMerchantGroup.appShortName,
      app_icon_ipfs:this.formMerchantGroup.appIcon
    });
    var newRegister=<MerchantGroup>{
      name:this.formMerchantGroup.name,
      pwaManifest:jsonpwa,
      id:SSUuid.GenerateV4(),
      adminMode:'static',
      createdAt:(new Date()).toISOString()
    };
    this.merchantGroupSvc.postApiMerchantGroup(newRegister).subscribe(
      (d)=>{
        console.log(d);
        if (d){
          this.systemSvc.selectedMerchantGroup=d;
          if (this.systemSvc.selectedMerchant==null){
            this.router.navigate(["/wizard-new-merchant"]);
          }
        }
      },
      (e)=>{
        alert(e);
      }
    )
  }


}
