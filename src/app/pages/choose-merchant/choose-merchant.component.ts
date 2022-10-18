import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Merchant, MerchantGroup } from 'src/app/api/models';
import { MerchantGroupService, MerchantService } from 'src/app/api/services';
import { ImgService } from 'src/app/services/img.service';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-choose-merchant',
  templateUrl: './choose-merchant.component.html',
  styleUrls: ['./choose-merchant.component.less']
})
export class ChooseMerchantComponent implements OnInit {

  public MerchantList:MerchantGroup[]=[];

  constructor(
    //Injections
    public systemSvc:SystemService,
    public merchantSvc:MerchantService,
    public router:Router,
    public imgSvc:ImgService
  ) { }

  imgLogo = null;


  ngOnInit(): void {
    this.initialize();
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

  initialize() {
    if (this.systemSvc.selectedMerchantGroup==null){
      this.router.navigate(["/choose-merchant-group"]);
      return;
    }
    this.merchantSvc.getApiMerchant().subscribe(
      (d)=>{
        this.MerchantList=d;
        if (d.length==0){
          this.createNewMerchant();
        }
      },
      (e)=>{
        console.log(e);
      }
    )
  }

  createNewMerchant(){
    this.router.navigate(["/wizard-new-merchant"]);
  }

  selectMerchant(m:Merchant){
    this.systemSvc.selectedMerchant=m;
    this.router.navigate(["/orders"]);
  }

}
