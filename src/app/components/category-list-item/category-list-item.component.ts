import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Enumerable from 'linq';
import { Item, Option, OptionGroupProduct } from 'src/app/api/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ChangePriceService } from 'src/app/services/catalog/change-price.service';
import { ItemEditorComponent } from '../item/item-editor/item-editor.component';
import { ItemService } from 'src/app/api/services';
import { CatalogDataService } from 'src/app/services/catalog/catalog-data.service';
import { __classPrivateFieldSet } from 'tslib';
import { ImgService } from 'src/app/services/img.service';
import { UploadUtil } from 'src/app/shared/upload-util';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map, timeout } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-category-list-item',
  templateUrl: './category-list-item.component.html',
  styleUrls: ['./category-list-item.component.scss']
})
export class CategoryListItemComponent implements OnInit {


  public text = "";
  public progress = 0;
  public meta = null;
  public file: Blob = null;

  private _item: Item;
  public get item(): Item {
    return this._item;
  }
  @Input() set item(item: Item){
    this._item = item;
    if (item && item.productIdNavigation.image) {
      this.onUploadImg(item.productIdNavigation.image, true);
    }
  }
  
  showOptions: boolean = false;
  loadDelete: boolean = false;
  uploadedImg: any;
  constructor(public changePriceSvc: ChangePriceService, public httpClient: HttpClient, public dialog: MatDialog, public imgSvc: ImgService, private itemSvc: ItemService, private catalogDataSvc: CatalogDataService) {
    var item = this.item;
    this.changePriceSvc.onSavePrices.subscribe(
      (data) => {
        if (data && data[this.item.id]) {
          this.item.price = data[this.item.id];
        }
      }
    );
    if (item && item.productIdNavigation.image) {
      this.onUploadImg(item.productIdNavigation.image, true);
    }
  }

  async changeImg() {
    var _self = this;
    var files = await UploadUtil.ChooseFileDialog();
    if (files.length > 0) {
      var _file = files[0];
      var _formData = new FormData();
      _formData.append("file", _file);
      this.progress = 0;
      this.text = "";
      this.httpClient.post<any>("./api/Sys/upload", _formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(timeout(5 * 60 * 1000))
        .pipe(map((event) => {

          switch (event.type) {

            case HttpEventType.UploadProgress:
              const progress = Math.round(100 * event.loaded / event.total!);
              return { status: 'progress', message: progress };

            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type} ${JSON.stringify(event)}`;
          }
        })
        )
        .subscribe(
          (res) => {
            console.log(res);
            if (res.status) {
              this.progress = res.message - 1;
            } else if (res.ipfsHash) {
              console.log(res.ipfsHash);
              this.text = res.ipfsHash;
              this.progress = 0;
              res.file = _file;
              _self.item.productIdNavigation.image = res.ipfsHash;
              this.catalogDataSvc.saveItem(_self.item).then(function (d) {
                // _self.load = false;
                // _self.dialogRef.close();
                _self.onUploadImg(_self.item.productIdNavigation.image, true);
              }).catch(function (e) {
                console.log(e);
              });
            }
            //_self.onUploadImg(res, false);
          },
          (err) => {
            console.log(err);
          }
        );
    }
    console.log(files);
  }

  onUploadImg(metadata, hasIpfsHash) {
    if (hasIpfsHash) {
      this.uploadedImg = this.imgSvc.getBlobUrlFromHashAsync(metadata);
    } else {
      this.uploadedImg = this.imgSvc.getBlobUrlFromHashAsync(metadata.ipfsHash);
    }
    //this.formMerchantGroup.appIcon=metadata.ipfsHash;
  }
  ngOnInit(): void {
    // if (this.item && this.item.id=="123-567-3333"){
    //   this.item.productIdNavigation.optionGroupProduct=[
    //     {
    //       id:"121-11-32563--23-2-",
    //       max:4,
    //       min:1,
    //       index:0,
    //       status:'ACTIVE',
    //       optionGroupIdNavigation:{
    //         name:"choose your drink",
    //         option:[
    //           {
    //             productIdNavigation:{
    //               name:"coke"
    //             },
    //             price:10,
    //             externalCode:"c1"
    //           },
    //           {
    //             productIdNavigation:{
    //               name:"soda"
    //             },
    //             price:11,
    //             externalCode:"s1"
    //           }
    //         ]

    //       }
    //     },
    //     {
    //       id:"9981-11-32563--23-2-",
    //       max:4,
    //       min:0,
    //       index:0,
    //       status:'ACTIVE',
    //       optionGroupIdNavigation:{
    //         name:"choose your launch",
    //         option:[
    //           {
    //             productIdNavigation:{
    //               name:"beef"
    //             },
    //             price:7,
    //             externalCode:"b34"
    //           },
    //           {
    //             productIdNavigation:{
    //               name:"chicken"
    //             },
    //             price:5,
    //             externalCode:"c3"
    //           }
    //         ]

    //       }
    //     }
    //   ]
    //   this.editItem();
    // }
  }

  alterStatusItem(status: string) {
    var _self = this;
    this.catalogDataSvc.setStatusItem(this.item.id, this.item.productId, status).then(function (d) {
      _self.item.status = status;
    });
  }
  setStatusOption(status: string, option: Option) {
    var _self = this;
    this.catalogDataSvc.setStatusOption(option.id, this.item.productId, status).then(function (d) {
      option.status = status;
    });
  }
  editItem() {
    var tmpItem = JSON.parse(JSON.stringify(this.item));
    var dialogRef = this.dialog.open(ItemEditorComponent, {
      width: "70vw",
      height: "100vh",
      position: { right: '0' },
      data: tmpItem
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result);
        if (result) {
          // this.categoryUpdated.emit(result);
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }
  async deleteItem() {
    let translate=AppComponent.Instance.translate;
    let title=await translate.get("categoryListItem.dlg.title").toPromise();
    let msg=await translate.get("categoryListItem.dlg.msg").toPromise();
    var _self = this;
    var dialogData: ConfirmDialogModel = {
      title: title,
      message: msg + this.item.productIdNavigation.name + '" ?',
      showCancel: true
    }
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "80vw",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(
      (ok) => {
        if (ok) {
          _self.loadDelete = true;
          this.catalogDataSvc.deleteItem(this.item).then(function (d) {
            _self.loadDelete = false;
          }, function () {
            _self.loadDelete = false;
          });
        }
      }
    );
  }
  toggleShowOptions() {
    if (this.showOptions) {
      this.showOptions = false;
    } else {
      this.showOptions = true;
    }
  }


}
