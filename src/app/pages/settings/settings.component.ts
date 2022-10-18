import { Component, OnInit } from '@angular/core';
import { SystemService } from 'src/app/services/system.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public menuItems = [
    "General",
    "Appearence",
    "Orders Endpoints",
    "Drivers Endpoints",
    "Debug"
  ];


  public selected = "General";

  public settingsData:any;
  public settingsDataPropertiesNames:string[];

  public getProperties(obj) {
    return Object.getOwnPropertyNames(obj);
  }

  constructor(
    public systemSvc: SystemService,
    public breakpointObserver: BreakpointObserver
  ) {

    this.settingsData= JSON.parse(JSON.stringify(systemSvc.localSettings));
    this.settingsDataPropertiesNames=Object.getOwnPropertyNames(this.settingsData);

    this.isHandset$.subscribe(d => {
      this._isHandset = d;
    });
  }


  addOrderEndpoint(){
    this.settingsData["Orders Endpoints"].Endpoints.push({
      name:'new order service connection',
      type:'webapi',
      sourceName:'odp',
      endpoint:"",
      clientId: "",
      clientSecret: "",
      publicKey: undefined,
      privateKey: undefined
    })
  }

  removeOrderEndpoint(endpoint:DtoAdapterConfig){
    this.settingsData["Orders Endpoints"].Endpoints.splice(
      this.settingsData["Orders Endpoints"].Endpoints.indexOf(endpoint),1
    );
  }


  updateSettings(){
    console.log("updating settings...");
    this.systemSvc.localSettings=this.settingsData;
  }


  _isHandset = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {

  }

}
