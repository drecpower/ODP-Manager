import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DtoMerchant, DtoOauthResponse, Merchant, MerchantGroup } from '../api/models';
import { SysService } from '../api/services';
import { AppComponent } from '../app.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../components/dialogs/confirm-dialog/confirm-dialog.component';
import { MatchMediaUtil } from '../shared/match-media-util';
import { SSAuthentication } from '../static-stack/authentication';
import { SSIpfs } from '../static-stack/ipfs';
import { SSOrbitdb } from '../static-stack/orbitdb';
import { SSUuid } from '../static-stack/uuid';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private _terminalId:string;
  get terminalId():string{
    if (!this._terminalId){
      let tId=localStorage.getItem("odp_terminal_id");
      this.terminalId=tId ? tId : "{{NEWGUID}}";
    }
    return this._terminalId;
  }
  set terminalId(value:string){
    this._terminalId=value;
    if (value=="{{NEWGUID}}"){
      this.terminalId="T__"+SSUuid.GenerateV4();
    }
    localStorage.setItem("odp_terminal_id",this.terminalId);
  }

  private _localSettings:any;
  get localSettings():any {
    if (!this._localSettings){
      let _tSettings=localStorage.getItem("odp_terminal_settings");
      if (_tSettings){
        this.localSettings=JSON.parse(_tSettings);
      } else {
        this.localSettings={
          General: {
            TerminalId: this.terminalId,
            OperationMode: this.isStaticAppOnly ? 'static' : 'api',
            Locale: "auto",
            Timer: 30
          },
          Appearence: {
            ColorTheme: "auto",
            StartMenu: "closed",
            Animations: "true"
          },
          "Orders Endpoints":{
            Endpoints:<DtoAdapterConfig[]>[
              // {
              //   name: "My Web Api",
              //   type: "webapi",
              //   sourceName: "odp",
              //   endpoint: "http://localhost:5075",
              //   clientId: "",
              //   clientSecret: "",
              //   publicKey: undefined,
              //   privateKey: undefined
              // },
              // {
              //   name: "My Websocket Api",
              //   type: "websocket",
              //   sourceName: "odp",
              //   endpoint: "http://localhost:5075",
              //   clientId: "",
              //   clientSecret: "",
              //   publicKey: undefined,
              //   privateKey: undefined
              // }
            ]
          },
          Debug: {}
        }
      }
      
    }
    return this._localSettings;
  }
  set localSettings(value:any){
    this._localSettings=value;
    localStorage.setItem("odp_terminal_settings",JSON.stringify(value));
  }
  public static Instance:SystemService;

  constructor(
    //Injections
    public sysSvc: SysService,
    public cryptoSvc:CryptoService,
    public router:Router,
    public dialog:MatDialog
  ) {
    SystemService.Instance=this;
    try {
      var tId=localStorage.getItem("odp_terminal_id");
      if (tId){
        this.terminalId=tId;
      } else {
        this.terminalId="{{NEWGUID}}";
        localStorage.setItem("odp_terminal_id",this.terminalId);
      }
    } catch (error) {
      
    }
    //Delayed for subject item ready with 'first next as false'
    setTimeout(() => {
      this._isSystemReady.next(false);
      setTimeout(() => {
        this._loadSystem();
      }, environment.production ? 0 : 500); //Delay loadSystem if in production mode to test splash screen
    }, 1);
  }

  getTheme(){
      return MatchMediaUtil.prefersColorScheme;
    }
  

  version:string="";
  private _loadSystem() {
    this.sysSvc.getApiSysVer().subscribe(
      (d) => {
        console.log(d);
        this.version=d;
        if (d && d.startsWith('static:')) {
          this.loadStaticStack();
        } else {
          this.loadApiStack();
        }
        
      }
    )
  }

  private async loadCommonShared(){
    await this.loadLocalPersistedChooses()
    if (this.selectedMerchantGroup==null){
      this.router.navigate(['/choose-merchant-group']);
    } else {
      if (this.isStaticAppOnly){
        try {
          let ipfsNode=await SSIpfs.getNode();
          var scriptElm = await SSOrbitdb.GetOrbitDbInstance(ipfsNode);
          this.logDatahashChannel = await SSOrbitdb.GetLogInstancePool(this.selectedMerchant.id + "_hashdata");
          let datahashChannel = this.logDatahashChannel.id;
          console.log("Started dataHashChannel: " + datahashChannel);
          this.logDatahashChannel.load();
        } catch (error) {
          console.log("ERROR GETTING ORBIT INSTANCE...");
          console.log(error);
        }
      }
    }
  }


  private async loadApiStack() {
    this.isStaticAppOnly = false;
    var oauthRes=localStorage.getItem("oauthresponse");
    if (oauthRes!=null){
      this.OauthToken=JSON.parse(oauthRes);
      this.isAuthenticated=true;
      await this.loadCommonShared();
      this._isSystemReady.next(true);
    } else {
      this.router.navigate(['/auth']);
      this._isSystemReady.next(true);
    }
    
  }

  logDatahashChannel;
  private async loadStaticStack() {
    this.isStaticAppOnly = true;
    let ipfsNode=await SSIpfs.getNode();
    let sessionIdentity=sessionStorage.getItem("wallet_getId");
    if (sessionIdentity==null) { 
      this.router.navigate(['/auth']);
      this._isSystemReady.next(true);
      return;
    }
    let orbitdbInstance=await SSOrbitdb.GetOrbitDbInstance(ipfsNode);
    this.OauthToken= {
      "accessToken": sessionIdentity,
      "type": "keypair",
      "expiresIn": 0
  };
    this.isAuthenticated=true;

    await this.loadCommonShared();
    this._isSystemReady.next(true);
  }

  public async reload(){
    this._isSystemReady.next(false);
    await new Promise(r => setTimeout(r, 64));
    this._loadSystem();
  }



  private _isSystemReady = new Subject<boolean>();
  public isSystemReadyAsync: Observable<boolean> = this._isSystemReady.asObservable();


  public isStaticAppOnly = false;
  public isAuthenticated = false;
  public OauthToken:DtoOauthResponse=null;

  private _selectedMerchantGroupChanged = new Subject<MerchantGroup>();
  public selectedMerchantGroupChanged: Observable<MerchantGroup> = this._selectedMerchantGroupChanged.asObservable();

  private _selectedMerchantGroup:MerchantGroup=null; 
  public set selectedMerchantGroup(newValue:MerchantGroup){
    this._selectedMerchantGroup=newValue;
    localStorage.setItem("system.selectedMerchantGroup",JSON.stringify(newValue));
    this._selectedMerchantGroupChanged.next(newValue);
  }
  public get selectedMerchantGroup():MerchantGroup {
    return this._selectedMerchantGroup;
  }

  private _selectedMerchantChanged = new Subject<Merchant>();
  public selectedMerchantChanged: Observable<Merchant> = this._selectedMerchantChanged.asObservable();

  private _selectedMerchant:Merchant=null;
  public get selectedMerchant():Merchant {
    return this._selectedMerchant;
  }
  public set selectedMerchant(newValue:Merchant){
    this._selectedMerchant=newValue;
    localStorage.setItem("system.selectedMerchant",JSON.stringify(newValue));
    this._selectedMerchantChanged.next(newValue);
  }

  loadLocalPersistedChooses() { 
    return new Promise<void>(
      async (resolve,reject)=>{
        [
          "system.selectedMerchantGroup",
          "system.selectedMerchant"
        ].forEach((field)=>{
          let _fieldValue=(localStorage.getItem(field));
          if (_fieldValue!=null){
            this["_"+field.split('.')[1]]=JSON.parse(_fieldValue);
          }
        });

        var __selectedMerchant= (localStorage.getItem("system.selectedMerchant"));
        resolve();
      }
    )
  }

  public async logout(){
    let translate=AppComponent.Instance.translate;
    let title=await translate.get("system.logout").toPromise();
    let msg=await translate.get("system.msg").toPromise();
    
    var dialogData:ConfirmDialogModel ={
      title:title,
      message:msg,
      showCancel:true
    }
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "80vw",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(
      (ok) => {
        if (ok) {
          this.selectedMerchant=null;
          this.selectedMerchantGroup=null;
          this.isAuthenticated=false;
          this.OauthToken=null;
          sessionStorage.clear();
          this.router.navigate(['/auth']);
        }
      }
    )

    return;

  }

}
