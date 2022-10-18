import { OrdersComponent } from './pages/orders/orders.component';

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SplashComponent } from './components/splash/splash.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DebugComponent } from './pages/debug/debug.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChooseMerchantComponent } from './pages/choose-merchant/choose-merchant.component';
import { WizardNewMerchantGroupComponent } from './pages/wizards/wizard-new-merchant-group/wizard-new-merchant-group.component';
import { ChooseMerchantGroupComponent } from './pages/choose-merchant-group/choose-merchant-group.component';
import { WizardNewMerchantComponent } from './pages/wizards/wizard-new-merchant/wizard-new-merchant.component';
import { HelpComponent } from './pages/help/help.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PageCategoryComponent } from './pages/page-category/page-category.component';
import { PublishComponent } from './pages/publish/publish.component';


const routes: Routes = [
  {
    path: "orders", redirectTo: 'orders/', pathMatch: 'full'
  },
  {
    path: "orders/:id", component: OrdersComponent, data: { animation: 'orders' }
  },
  {
    path: "category", component: PageCategoryComponent, data: { animation: 'orders' }
  },
  {
    path: "auth", component: AuthComponent, data: { animation: 'auth' }
  },
  {
    path: "splash", component: SplashComponent, data: { animation: 'debug' }
  },
  {
    path: "debug", component: DebugComponent, data: { animation: 'debug' }
  },
  {
    path: "choose-merchant", component: ChooseMerchantComponent, data: { animation: 'choose-merchant' }
  },
  {
    path: "choose-merchant-group", component: ChooseMerchantGroupComponent, data: { animation: 'choose-merchant-group' }
  },
  {
    path: "wizard-new-merchant-group", component: WizardNewMerchantGroupComponent, data: { animation: 'wizard-new-merchant-group' }
  },
  {
    path: "wizard-new-merchant", component: WizardNewMerchantComponent, data: { animation: 'wizard-new-merchant' }
  },
  {
    path: "help", component: HelpComponent, data: { animation: 'help' }
  },
  {
    path: "publish", component: PublishComponent, data: { animation: 'publish' }
  },
  {
    path: "settings", component: SettingsComponent, data: { animation: 'settings' }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true }), BrowserAnimationsModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(){
    
  }
}

