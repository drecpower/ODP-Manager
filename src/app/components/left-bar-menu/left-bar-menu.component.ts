import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MerchantGroup } from 'src/app/api/models';
import { ImgService } from 'src/app/services/img.service';
import { SystemService } from 'src/app/services/system.service';
import { animGrowAnimation, animGrowMenuAnimation } from 'src/app/shared/animations';
import { SSIpfs } from 'src/app/static-stack/ipfs';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-left-bar-menu',
  templateUrl: './left-bar-menu.component.html',
  styleUrls: ['./left-bar-menu.component.less'],
  animations: [
    animGrowAnimation,
    animGrowMenuAnimation
  ]
})
export class LeftBarMenuComponent implements OnInit {

  public static instance: LeftBarMenuComponent = null;
  imgLogo: any = "";
  constructor(
    public systemSvc: SystemService,
    public route: Router,
    public dialog: MatDialog,
    public imgSvc: ImgService
  ) {
    LeftBarMenuComponent.instance = this;
  }

  showText = false;

  toogleShowText() {
    this.showText = !this.showText;
  }

  notImplemented() {
    var dialogData: ConfirmDialogModel = {
      title: "Sorry :-(",
      message: "This feature is not implemented yet.",
      showCancel: false
    }
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "80vw",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result);

      },
      (error) => {
        console.log(error);
      }
    )
  }
  async getAppIconUrl(mgrp: MerchantGroup) {
    if (mgrp && mgrp.pwaManifest) {
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

  ngOnInit(): void {
    this.systemSvc.isSystemReadyAsync.subscribe(async p => {
      if (p) {
        this.imgLogo = await this.getAppIconUrl(this.systemSvc.selectedMerchantGroup);
      }
    });

    this.systemSvc.selectedMerchantGroupChanged.subscribe(async p => {
      if (p) {
        this.imgLogo = await this.getAppIconUrl(this.systemSvc.selectedMerchantGroup);
      }
    });
  }
}
