import { Component } from '@angular/core';
import { SystemService } from './services/system.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  // ...
} from '@angular/animations';
import { Router, RouterOutlet, RouterStateSnapshot } from '@angular/router';
import { animFadeInOutAnimation, animRouteTransition } from './shared/animations';
import { IntegratorService } from './services/integrator/integrator.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations: [
    animFadeInOutAnimation,
    animRouteTransition
  ]
})
export class AppComponent {
  title = 'AdminApp';
  public static Instance:AppComponent;
  constructor(
    public systemSvc: SystemService,
    public route: Router,
    private integratorSvc: IntegratorService,
    public translate:TranslateService
  ) {
    AppComponent.Instance=this;
    translate.setDefaultLang('en');
    let currentLanguage=translate.getBrowserLang();
    if (currentLanguage) translate.use(currentLanguage);

    localStorage.setItem("app_loaded", "true");
    document.getElementById("loading_application")?.remove();
    systemSvc.isSystemReadyAsync.subscribe(
      (isReady) => {
        if (isReady) {
          this.initialize();

        }
      }
    )
  }

  async initialize() {
    console.log("AdminClientApp initialized");


    this.integratorSvc.startPooling(30);
  }

  ngOnInit() {

  }
}
