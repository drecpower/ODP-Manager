import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SystemService } from 'src/app/services/system.service';
import { AuthenticationService } from 'src/app/api/services';
import { DtoOauthRequest } from 'src/app/api/models';
import { CryptoService } from 'src/app/services/crypto.service';
import { downloadUtil } from 'src/app/shared/download-util';
import { SSOrbitdb } from 'src/app/static-stack/orbitdb';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { SSWeb3 } from 'src/app/static-stack/web3';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {

  constructor(
    //Injections
    public _http: HttpClient,
    public _router: Router,
    public dialog: MatDialog,
    public systemSvc: SystemService,
    public authSvc: AuthenticationService,
    public cryptoSvc: CryptoService
  ) { }

  ngOnInit(): void {
    this.systemSvc.OauthToken = null;
    this.systemSvc.isAuthenticated = false;
    localStorage.removeItem("oauthrequest");

    if (this.systemSvc.isStaticAppOnly) {
      this.checkMetamask();
    }
  }

  checkMetamask() {
    setTimeout(async () => {
      if (!(window["web3"] && window["web3"]["__isMetaMaskShim__"])) {
        let translate = AppComponent.Instance.translate;
        let title = await translate.get("auth.nometamasktitle").toPromise();
        let msg = await translate.get("auth.nometamaskmsg").toPromise();
        var dialogData: ConfirmDialogModel = {
          title: title,
          message: msg,
          showCancel: false
        }
        var dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "80vw",
          data: dialogData
        });
        dialogRef.afterClosed().subscribe(
          (ok) => {
            if (ok) {
              window.open("https://metamask.io/", "_blank");
              window.location.reload();
            }
          }
        )
      } else {
        SSWeb3.checkChainNetwork();
      }
    }, 1000);
  }



  _usr: string = "";
  _pwd: string = "";
  _msg: string = "";

  public keydownListener(evt: any) {
    if (evt.code == "Enter") {
      this.doLogin();
    }
  }

  public async doLoginWithWallet() {
    var identity = await SSOrbitdb.GetEthWalletIdentity();
    this._router.navigate(['/orders']);
    setTimeout(() => {
      window.location.reload();
    }, 100);
    console.log(identity);
  }

  public doLogin() {
    this.authSvc.postApiAuthenticationOauthToken({
      clientId: this._usr,
      clientSecret: this._pwd
    }).subscribe(
      (d) => {
        this.systemSvc.OauthToken = d;
        this.systemSvc.isAuthenticated = true;
        if (this.systemSvc.selectedMerchantGroup == null) {
          this._router.navigate(['/choose-merchant-group']);
        } else {
          this._router.navigate(['/orders']);
        }

        localStorage.setItem("oauthresponse", JSON.stringify(d));
      },
      (e) => {
        console.log(e);
      }
    )
  }

}