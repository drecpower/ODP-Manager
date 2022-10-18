import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';


import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HttpClient/* other http imports */ } from "@angular/common/http";
import { OrdersComponent } from './pages/orders/orders.component';
import { OrdersDetailComponent } from './components/order-detail/order-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { CommonModule } from '@angular/common';
import { httpInterceptorProviders } from './api-interceptors';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from "@angular/material/toolbar";
import { SplashComponent } from './components/splash/splash.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AuthComponent } from './pages/auth/auth.component';
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DebugComponent } from './pages/debug/debug.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { WizardNewMerchantGroupComponent } from './pages/wizards/wizard-new-merchant-group/wizard-new-merchant-group.component';
import { ChooseMerchantComponent } from './pages/choose-merchant/choose-merchant.component';
import { ChooseMerchantGroupComponent } from './pages/choose-merchant-group/choose-merchant-group.component';
import { WizardNewMerchantComponent } from './pages/wizards/wizard-new-merchant/wizard-new-merchant.component';
import { MffUploadFileComponent } from './components/mat-form-field/mff-upload-file/mff-upload-file.component';
import { LeftBarMenuComponent } from './components/left-bar-menu/left-bar-menu.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { HelpComponent } from './pages/help/help.component';
import { AngularSplitModule } from 'angular-split';

import { SettingsComponent } from './pages/settings/settings.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryEditorComponent } from './components/category-editor/category-editor.component';
import { PageCategoryComponent } from './pages/page-category/page-category.component';

import {MatMenuModule} from '@angular/material/menu';
import { CategoryListItemComponent } from './components/category-list-item/category-list-item.component';
import { ItemEditorComponent } from './components/item/item-editor/item-editor.component';
import { ItemDetailsComponent } from './components/item/item-details/item-details.component';
import { ItemPriceComponent } from './components/item/item-price/item-price.component';
import { ItemComplementComponent } from './components/item/item-complement/item-complement.component';
import { ItemClassificationComponent } from './components/item/item-classification/item-classification.component';
import { ItemAvailabilityComponent } from './components/item/item-availability/item-availability.component';
import {MatRadioModule} from '@angular/material/radio';
import { OptionGroupListItemComponent } from './components/option/option-group-list-item/option-group-list-item.component';
import { OptionGroupProductEditorComponent } from './components/option/option-group-product-editor/option-group-product-editor.component';
import { OptionEditorComponent } from './components/option/option-editor/option-editor.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { PublishComponent } from './pages/publish/publish.component';
import { PizzaCrustEditorComponent } from './components/pizza-crust-editor/pizza-crust-editor.component';
import { PizzaEdgeEditorComponent } from './components/pizza-edge-editor/pizza-edge-editor.component';
import { PizzaSizeEditorComponent } from './components/pizza-size-editor/pizza-size-editor.component';
import { ChangeDebouncedDirective } from './directives/change-debounced.directive';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    OrdersDetailComponent,
    SplashComponent,
    AuthComponent,
    DebugComponent,
    OrderStatusComponent,
    WizardNewMerchantGroupComponent,
    ChooseMerchantComponent,
    ChooseMerchantGroupComponent,
    WizardNewMerchantComponent,
    MffUploadFileComponent,
    LeftBarMenuComponent,
    ConfirmDialogComponent,
    HelpComponent,
    SettingsComponent,
    CategoryComponent,
    PageCategoryComponent,
    CategoryEditorComponent,
    CategoryListItemComponent,
    ItemEditorComponent,
    ItemDetailsComponent,
    ItemPriceComponent,
    ItemComplementComponent,
    ItemClassificationComponent,
    ItemAvailabilityComponent,
    OptionGroupListItemComponent,
    OptionGroupProductEditorComponent,
    OptionEditorComponent,
    PublishComponent,
    PizzaCrustEditorComponent,
    PizzaEdgeEditorComponent,
    PizzaSizeEditorComponent,
    ChangeDebouncedDirective
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      defaultLanguage:'en-US',
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
      }),
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
    AngularSplitModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  providers: [
    httpInterceptorProviders,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab);
  }
}