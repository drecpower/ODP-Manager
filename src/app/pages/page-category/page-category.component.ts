import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Enumerable from 'linq';
import { Catalog, Category, Item } from 'src/app/api/models';
import { CategoryService } from 'src/app/api/services';
import { CategoryEditorComponent } from 'src/app/components/category-editor/category-editor.component';
import { ItemEditorComponent } from 'src/app/components/item/item-editor/item-editor.component';
import { CatalogDataService } from 'src/app/services/catalog/catalog-data.service';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-page-category',
  templateUrl: './page-category.component.html',
  styleUrls: ['./page-category.component.scss']
})
export class PageCategoryComponent implements OnInit, DoCheck {
  @ViewChild('tabs', { static: false }) tabs;
  realignInkBar() {
    var _self = this;
    setTimeout(() => {
      try {
        if (_self.tabs) {
          _self.tabs.realignInkBar();
        }
      } catch (error) {
        console.log("erro: " + error);
      }
    }, 0);
  }

  constructor(public dialog: MatDialog, public catalogDataSvc: CatalogDataService,
    public systemSvc: SystemService) {
    this.catalogDataSvc.start();
    this.catalogDataSvc.load();
    // if (this.catalogDataSvc.categoriesDb.length > 0) {
    //   this.filterCategories();
    // }
    // this.catalogDataSvc.onLoadCatalogs.subscribe(
    //   (data) => {
    //     if (this.catalogDataSvc.catalogs.length > 0) {
    //       this.catalog = this.catalogDataSvc.catalogs[0];
    //     }
    //   }
    // );
    // this.catalogDataSvc.onLoadCategories.subscribe(
    //   (data) => {
    //     this.filterCategories();
    //   }
    // );
  }
  ngDoCheck(): void {
    this.realignInkBar();
  }

  ngOnInit(): void {
    // this.realignInkBar();
    this.systemSvc.selectedMerchant.name
  }

  addCategory() {
    var newCategory: Category = {
      name: "",
      template: "",
      status: "AVAILABLE",
      catalogId: this.catalogDataSvc.catalog.id
    }
    var dialogRef = this.dialog.open(CategoryEditorComponent, {
      width: "70vw",
      height: "100vh",
      position: { right: '0' },
      data: newCategory
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
  addItem() {
    var newItem: Item = {
      categoryId: "",
      id: "",
      status: "AVAILABLE",
      productIdNavigation: {
        id: "",
        description: undefined,
        name: undefined,
        merchantGroupId: this.systemSvc.selectedMerchantGroup.id
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
  reorder() {

  }
}
