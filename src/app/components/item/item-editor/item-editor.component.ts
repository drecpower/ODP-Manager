import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Enumerable from 'linq';
import { Item, OptionGroupProduct } from 'src/app/api/models';
import { ItemService } from 'src/app/api/services';
import { CatalogDataService } from 'src/app/services/catalog/catalog-data.service';
import { SystemService } from 'src/app/services/system.service';
import { SSUuid } from 'src/app/static-stack/uuid';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { OptionGroupProductEditorComponent } from '../../option/option-group-product-editor/option-group-product-editor.component';

@Component({
  selector: 'app-item-editor',
  templateUrl: './item-editor.component.html',
  styleUrls: ['./item-editor.component.scss']
})
export class ItemEditorComponent implements OnInit {
  private notChangedItem: Item = {};
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ItemEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Item, private itemSvc: ItemService, private catalogDataSvc: CatalogDataService,
    private systemSvc: SystemService) {
    try {
      this.notChangedItem = JSON.parse(JSON.stringify(item));
    } catch (error) {

    }
  }
  currentTab: string = 'Details';
  load: boolean = false;
  //listTabs: string[] = ["Details", "Price", "Complement", "Classification", "Availability"];
  listTabs: string[] = ["Details", "Price", "Complement", "Availability"];
  hasComplement: boolean = false;
  ngOnInit(): void {
    if (this.item && this.item.id) {
      if (this.item.productIdNavigation.optionGroupProduct && this.item.productIdNavigation.optionGroupProduct.length > 0) {
        this.hasComplement = true;
      }
    }
    // this.addComplementGroup();
  }
  setTab(name: string) {
    if (this.item.id) {
      this.currentTab = name;
    }
    else {
      if (this.listTabs.indexOf(name) <= this.listTabs.indexOf(this.currentTab)) {
        this.currentTab = name;
      }
    }
  }
  continue() {
    var _self = this;
    var ret = _self.validate();
    if (ret == "") {
      var idx = this.listTabs.indexOf(this.currentTab);
      var newIdx = idx + 1;
      if ((newIdx <= (this.listTabs.length - 1)) && !(this.item.id != undefined && this.item.id != null && this.item.id != "")) {
        this.currentTab = this.listTabs[newIdx];
      } else {
        console.info('save item');
        console.dir(this.item);
        _self.load = true;
        this.catalogDataSvc.saveItem(this.item).then(function (d) {
          console.log("close");
          _self.load = false;
          _self.dialogRef.close();
        }).catch(function (e) {
          _self.load = false;
          console.log(e);
        });
      }
    }else{
      this.openDialog(ret);
    }
  }
  validate() {
    var ret = ""
    if (this.item.productIdNavigation.name == '' || this.item.productIdNavigation.name == undefined) {
      ret = "Fill in the product name";
    }
    return ret;
  }
  cancel() {
    this.dialogRef.close();
  }
  openDialog(msg: string) {
    var dialogData: ConfirmDialogModel = {
      title: "Atention",
      message: msg,
      showCancel: true
    }
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "80vw",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(
      (ok) => {
        if (ok) {
        }
      }
    );
  }
  addComplementGroup() {
    var tmpItem: OptionGroupProduct = {
      id: undefined,
      min: 0,
      max: 1,
      status: "AVAILABLE",
      optionGroupIdNavigation: {
        name: "",
        status: "AVAILABLE",
        merchantId: this.systemSvc.selectedMerchant.id
      }
    }
    var dialogRef = this.dialog.open(OptionGroupProductEditorComponent, {
      width: "70vw",
      height: "100vw",
      position: { right: '0' },
      data: tmpItem
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result);
        if (result) {
          if (!this.item.productIdNavigation.optionGroupProduct) {
            this.item.productIdNavigation.optionGroupProduct = [];
          }
          this.item.productIdNavigation.optionGroupProduct.push(result);
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }

  onDeletedOptionGroup(ogp: OptionGroupProduct) {
    var idx = this.item.productIdNavigation.optionGroupProduct.indexOf(ogp);
    if (idx >= 0) {
      this.item.productIdNavigation.optionGroupProduct.splice(idx, 1);
    }
  }
}
