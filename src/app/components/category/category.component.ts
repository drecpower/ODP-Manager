import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Enumerable from 'linq';
import { Category } from 'src/app/api/models';
import { Item } from 'src/app/api/models';
import { CategoryEditorComponent } from '../category-editor/category-editor.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ItemEditorComponent } from '../item/item-editor/item-editor.component';
import { CategoryService } from 'src/app/api/services';
import { CatalogDataService } from 'src/app/services/catalog/catalog-data.service';
import { SystemService } from 'src/app/services/system.service';
import { __classPrivateFieldSet } from 'tslib';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  paused: boolean = false;
  loadDelete: boolean = false;
  loadGet: boolean = false;
  food = [];
  activate: boolean = true;
  @Input() category:Category|undefined;
  
  items: Item[]|undefined = [];
  showItems:boolean=false;
  constructor(public dialog: MatDialog, private categorySvc: CategoryService, private catalogDataSvc: CatalogDataService,
    private systemSvc:SystemService) { }

  ngOnInit(): void {
  }

  addItem(){
    var newItem :Item={
      categoryId:this.category.id,
      status:"AVAILABLE",
      productIdNavigation:{
        name:undefined,
        status:"AVAILABLE",
        merchantGroupId:this.systemSvc.selectedMerchantGroup.id

      }
    }
    
    var dialogRef = this.dialog.open(ItemEditorComponent, {
      width: "70vw",
      height: "100vh",
      position: { right: '0' },
      data: newItem
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

  editCategory() {
    var dialogRef = this.dialog.open(CategoryEditorComponent, {
      width: "70vw",
      height: "100vw",
      position: { right: '0' },
      data: this.category
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result);
        if (result) {
        }
      },
      (error) => {
        console.error(error);
      }
    )
  } 

  async deleteCategory(){
    let translate=AppComponent.Instance.translate;
    let title=await translate.get("ccategory.dlg.title").toPromise();
    let msg=await translate.get("ccategory.dlg.msg").toPromise();

    var _self = this;
    var dialogData:ConfirmDialogModel ={
      title:title,
      message:msg + this.category.name + '" ?',
      showCancel:true
    }
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "80vw",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(
      (ok) => {
        if (ok) {
          _self.loadDelete = true;
          this.catalogDataSvc.deleteCategory(this.category.id).then(function(d){
            _self.loadDelete = false;
          }, function(){
            _self.loadDelete = false;
          });
        }
      }
    )
  }

  alterStatus(status: string){
    this.category.status = status;
  }

  toggleShowItems(){
    if(this.showItems){
      this.showItems=false;
    }else{
      this.showItems=true;
    }
  }
}
