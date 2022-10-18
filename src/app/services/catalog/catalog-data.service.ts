import { Injectable } from '@angular/core';
import Enumerable from 'linq';
import { Subject } from 'rxjs';
import { Catalog, Category, Item, OptionGroup, OptionGroupProduct, Product } from 'src/app/api/models';
import { OptionGroupProductService, OptionGroupService, OptionService, ProductService } from 'src/app/api/services';
import { CatalogService } from 'src/app/api/services/catalog.service';
import { ConfirmDialogComponent } from 'src/app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from 'src/app/api/services/category.service';
import { ItemService } from 'src/app/api/services/item.service';
import { SSUuid } from 'src/app/static-stack/uuid';
import { ConfirmDialogModel } from 'src/app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { SystemService } from '../system.service';
import { SSOrbitdb } from 'src/app/static-stack/orbitdb';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {

  public catalogs: Catalog[] = [];
  private _onLoadCatalogsSubject = new Subject<any>();
  public onLoadCatalogs = this._onLoadCatalogsSubject.asObservable();
  public categoriesDb: Category[] = [];
  private _onLoadCategoriesSubject = new Subject<any>();
  public onLoadCategories = this._onLoadCategoriesSubject.asObservable();
  categories: Category[] = [];
  optionGroupProducts: OptionGroupProduct[] = []
  optionGroups: OptionGroup[] = [];
  catFilter: string = "";
  loadCatalog: boolean = false;
  private _catalog: Catalog;
  public get catalog(): Catalog {
    return this._catalog;
  }
  public set catalog(v: Catalog) {
    this._catalog = v;
    this.getCategories(v.id);
  }
  constructor(private categorySvc: CategoryService,
    private catalogSvc: CatalogService,
    public dialog: MatDialog,
    private itemSvc: ItemService,
    private optionGroupProductSvc: OptionGroupProductService,
    private optionGroupSvc: OptionGroupService,
    private productSvc: ProductService,
    private optionSvc: OptionService,
    private systemSvc: SystemService) {

  }
  filterCategories() {
    if (this.catFilter && this.catFilter != "") {
      this.categories = Enumerable.from(this.categoriesDb).where(x => x.id == this.catFilter).toArray();
    } else {
      this.categories = Enumerable.from(this.categoriesDb).toArray();
    }
  }
  load() {
    var _self = this;
    _self.loadCatalog = true;
    var id = "55d0e3fb-f932-11eb-b388-000d3a8abda5";
    try {
      if (this.systemSvc.selectedMerchant.id) {
        id = this.systemSvc.selectedMerchant.id;
      }
    } catch (error) {
    }
    this.catalogSvc.getApiCatalogMerchantMerchantId(id).subscribe(
      (data) => {
        this.catalogs = data;
        if (this.catalogs.length > 0) {
          this.catalog = this.catalogs[0];
        }
        this._onLoadCatalogsSubject.next(data);
        setTimeout(() => {
          _self.loadCatalog = false;
        }, 1000);

      }, (error) => {
        console.log(error);
        _self.loadCatalog = false;
      }
    );
  }
  start() {
    this.catFilter = "";
    this.categories = [];
    this.categoriesDb = [];
    this.catalogs = [];
  }

  getCategories(catalogId: string) {
    this.categorySvc.getApiCategoryCatalogCatalogId(catalogId).subscribe(
      (data) => {
        this.categoriesDb = data;
        this._onLoadCatalogsSubject.next(this.categoriesDb);
        this.getOptionGroups();
        this.filterCategories();
      },
      (err) => {
        console.error(err);
      }
    );
  }
  getOptionGroups() {
    this.optionGroupProductSvc.getApiOptionGroupProduct().subscribe(
      (data) => {
        this.optionGroupProducts = data
        this.optionGroupSvc.getApiOptionGroup().subscribe(
          (data2) => {
            this.optionGroups = data2;
            this.populateOptionGroups();
          }
        );
      }
    )
  }

  async saveCategory(category: Category) {
    return new Promise((resolve, reject) => {
      if (category.id) {
        this.categorySvc.putApiCategoryId({ id: category.id, body: category }).subscribe((data) => {
          var c = Enumerable.from(this.categoriesDb).where(x => x.id == category.id).defaultIfEmpty(undefined).firstOrDefault();
          if (c != undefined) {
            var idx = this.categoriesDb.indexOf(c);
            this.categoriesDb[idx] = category;
          }
          var c2 = Enumerable.from(this.categories).where(x => x.id == category.id).defaultIfEmpty(undefined).firstOrDefault();
          if (c2 != undefined) {
            var idx2 = this.categories.indexOf(c2);
            this.categories[idx2] = category;
          }
          resolve(true);
          // this.dialogRef.close(category)
        }, (error) => {
          reject(error);
        });
      } else {
        category.id = SSUuid.GenerateV4();
        this.categorySvc.postApiCategory(category).subscribe((data) => {
          this.categoriesDb.push(data);
          if (this.catFilter == "") {
            this.categories.push(data);
          }
          resolve(true);
          // this.dialogRef.close(category)
        }, (error) => {
          reject(error);
          console.log(error);
        });
      }
      return
    });

  }

  deleteCategory(id: string) {
    return new Promise((resolve, reject) => {
      this.categorySvc.deleteApiCategoryId(id).subscribe(
        (ret) => {
          this.categories = Enumerable.from(this.categories).where(x => x.id != id).toArray();
        }, (error) => {
          console.log(error);
        }
      );
    });
  }

  getItemByCategory(id: string) {
    return new Promise<Item[]>((resolve, reject) => {
      this.itemSvc.getApiItemCategoryCategoryId(id).subscribe(
        (ret) => {
          resolve(ret);
        }, (error) => {
          console.log(error);
        }
      );
    });
  }

  saveItem(obj: Item) {
    return new Promise((resolve, reject) => {
      if (obj.id) {
        var it: Item = JSON.parse(JSON.stringify(obj));
        this.setIdsComplements(it);
        this.itemSvc.putApiItemId({ id: it.id, body: it }).subscribe(
          (data) => {
            var cat: Category = Enumerable.from(this.categoriesDb).where(w => w.id == it.categoryId).firstOrDefault();
            console.log(it);
            if (cat) {
              console.log("cat");
              var item = Enumerable.from(cat.item).where(w => w.id == it.id).firstOrDefault();
              if (item) {
                console.log("item");
                var idx = cat.item.indexOf(item);
                if (idx >= 0) {
                  cat.item[idx] = it;
                  //this.dialogRef.close();
                  console.log("resolve");
                  resolve(item);
                }
              }
            }
          }
        );
      } else {
        var it: Item = JSON.parse(JSON.stringify(obj));
        it.id = SSUuid.GenerateV4();
        if (it.productIdNavigation && !it.productIdNavigation.id) {
          it.productIdNavigation.id = SSUuid.GenerateV4();
        }
        this.setIdsComplements(it);
        this.itemSvc.postApiItem(it).subscribe(
          (data) => {
            var cat = Enumerable.from(this.categoriesDb).where(w => w.id == it.categoryId).firstOrDefault();
            if (cat) {
              if (cat.item == undefined) {
                cat.item = [];
              }
              if(cat.template != "PIZZA"){
                cat.item.push(it);
              }
              resolve(it);
              //this.dialogRef.close();
            }
          }
        );
      }
    });
  }

  saveProduct(obj: Product) {
    return new Promise<Product>((resolve, reject) => {
      if (obj.id) {
        var p: Product = JSON.parse(JSON.stringify(obj));
        this.productSvc.putApiProductId({ id: p.id, body: p }).subscribe(
          (data) => {
            // var cat: Category = Enumerable.from(this.categoriesDb).where(w => w.id == it.categoryId).firstOrDefault();
            console.log(data);
            if (data) {
              // console.log("cat");
              // var item = Enumerable.from(cat.item).where(w => w.id == it.id).firstOrDefault();
              // if (item) {
              //   console.log("item");
              //   var idx = cat.item.indexOf(item);
              //   if (idx >= 0) {
              //     cat.item[idx] = it;
              //     //this.dialogRef.close();
              //     console.log("resolve");
              //     resolve(item);
              resolve(data);
              //   }
              // }
            }
          }
        );
      } else {
        var p: Product = JSON.parse(JSON.stringify(obj));
        p.id = SSUuid.GenerateV4();
        // it.productIdNavigation.id = SSUuid.GenerateV4();
        // this.setIdsComplements(it);
        this.productSvc.postApiProduct(p).subscribe(
          (data) => {
            // var cat = Enumerable.from(this.categoriesDb).where(w => w.id == it.categoryId).firstOrDefault();
            // if (cat) {
            //   if (cat.item == undefined) cat.item = [];
            //   cat.item.push(it);
            resolve(data);
            //this.dialogRef.close();
            // }
          }
        );
      }
    });
  }

  saveOptionGroup(obj: OptionGroup) {
    return new Promise<OptionGroup>((resolve, reject) => {
      if (obj.id) {
        var og: OptionGroup = JSON.parse(JSON.stringify(obj));
        // for (let i = 0; i < og.optionGroupProduct.length; i++) {
        //   if (!og.optionGroupProduct[i].id) {
        //     og.optionGroupProduct[i].id = SSUuid.GenerateV4();
        //   }
        // }
        this.optionGroupSvc.putApiOptionGroupId({ id: og.id, body: og }).subscribe(
          (data) => {
            // var cat: Category = Enumerable.from(this.categoriesDb).where(w => w.id == it.categoryId).firstOrDefault();
            console.log(data);
            if (data) {
              // console.log("cat");
              // var item = Enumerable.from(cat.item).where(w => w.id == it.id).firstOrDefault();
              // if (item) {
              //   console.log("item");
              //   var idx = cat.item.indexOf(item);
              //   if (idx >= 0) {
              //     cat.item[idx] = it;
              //     //this.dialogRef.close();
              //     console.log("resolve");
              //     resolve(item);
              resolve(data);
              //   }
              // }
            }
          }
        );
      } else {
        var og: OptionGroup = JSON.parse(JSON.stringify(obj));
        og.id = SSUuid.GenerateV4();
        for (let i = 0; i < og.optionGroupProduct.length; i++) {
          if (!og.optionGroupProduct[i].id) {
            og.optionGroupProduct[i].id = SSUuid.GenerateV4();
          }
        }
        // it.productIdNavigation.id = SSUuid.GenerateV4();
        // this.setIdsComplements(it);
        this.optionGroupSvc.postApiOptionGroup(og).subscribe(
          (data) => {
            // var cat = Enumerable.from(this.categoriesDb).where(w => w.id == it.categoryId).firstOrDefault();
            // if (cat) {
            //   if (cat.item == undefined) cat.item = [];
            //   cat.item.push(it);
            resolve(data);
            //this.dialogRef.close();
            // }
          }
        );
      }
    });
  }

  setIdsComplements(item: Item) {
    try {
      for (let i = 0; i < item.productIdNavigation.optionGroupProduct.length; i++) {
        var optionGroupId = item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.id;
        if (!item.productIdNavigation.optionGroupProduct[i].id) {
          item.productIdNavigation.optionGroupProduct[i].id = SSUuid.GenerateV4();
          optionGroupId = SSUuid.GenerateV4();
          item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.id = optionGroupId
          item.productIdNavigation.optionGroupProduct[i].optionGroupId = optionGroupId;
          item.productIdNavigation.optionGroupProduct[i].productId = item.productIdNavigation.id;
        }

        for (let y = 0; y < item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.option.length; y++) {
          if (!item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.option[y].id) {
            item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.option[y].id = SSUuid.GenerateV4();
            item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.option[y].optionGroupId = optionGroupId;
          }
          if (!item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.option[y].productIdNavigation.id) {
            var productId = SSUuid.GenerateV4();
            item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.option[y].productIdNavigation.id = productId;
            item.productIdNavigation.optionGroupProduct[i].optionGroupIdNavigation.option[y].productId = productId;
          }
        }
      }
    } catch (error) {
    }
  }

  deleteItem(item: Item) {
    return new Promise((resolve, reject) => {
      this.itemSvc.deleteApiItemId(item.id).subscribe(
        (ret) => {
          var cat = Enumerable.from(this.categoriesDb).where(x => x.id == item.categoryId).firstOrDefault();
          if (cat) {
            cat.item = Enumerable.from(cat.item).where(x => x.id != item.id).toArray();
          }
          resolve(item);
        }
      );
    });
  }
  async populateOptionGroups() {
    for (let i = 0; i < this.categoriesDb.length; i++) {
      const cat = this.categoriesDb[i];
      if (this.systemSvc.isStaticAppOnly && cat.item == undefined) {
        var dbdoc: any = await SSOrbitdb.GetDocInstance('Item');
        var objs = dbdoc.query((doc) => doc.categoryId == cat.id);
        cat.item = objs;
      }
      for (let j = 0; j < cat.item.length; j++) {
        const item = cat.item[j];
        if (!this.systemSvc.isStaticAppOnly) {
          item.productIdNavigation.optionGroupProduct = Enumerable.from(this.optionGroupProducts).where(x => x.productId == item.productId).toArray();
          for (let k = 0; k < item.productIdNavigation.optionGroupProduct.length; k++) {
            const ogp = item.productIdNavigation.optionGroupProduct[k];
            ogp.optionGroupIdNavigation = Enumerable.from(this.optionGroups).where(x => x.id == ogp.optionGroupId).defaultIfEmpty(null).firstOrDefault();
          }
        }
      }
    }
    this.filterCategories();
  }

  setStatusItem(itemId: string, productId: string, status: string) {
    return new Promise<void>((resolve, reject) => {
      this.productSvc.getApiProductIdSharingCount(productId).subscribe(
        (data) => {
          var resources = [];
          if (data.items > 0) {
            resources.push("ITEM");
          }
          if (data.options > 0) {
            resources.push("OPTION");
          }
          if ((data.items + data.options) > 1) {
            var dialogData: ConfirmDialogModel = {
              title: "Shared item",
              message: 'this item is shared in another category, add-on group or menu. Do you want to activate on all of them ?',
              showCancel: true
            }
            var dialogRef = this.dialog.open(ConfirmDialogComponent, {
              maxWidth: "80vw",
              data: dialogData
            });
            dialogRef.afterClosed().subscribe(
              (ok) => {
                if (ok) {
                  this.productSvc.putApiProductIdStatus(<ProductService.PutApiProductIdStatusParams>{
                    id: productId,
                    resources: resources,
                    status: status
                  }).subscribe(
                    (data2) => {
                      resolve();
                    }, (err) => {
                      reject
                    }
                  );
                }
              }, (err) => {
                reject();
              }
            );
          } else {
            this.itemSvc.putApiItemStatus(<ItemService.PutApiItemStatusParams>{
              items: [itemId],
              productId: productId,
              status: status
            }).subscribe(
              (data2) => {
                resolve();
              }, (err) => {
                reject
              }
            );
          }
        }
      );
    });
  }
  setStatusOption(itemId: string, productId: string, status: string) {
    return new Promise<void>((resolve, reject) => {
      this.productSvc.getApiProductIdSharingCount(productId).subscribe(
        (data) => {
          var resources = [];
          if (data.items > 0) {
            resources.push("ITEM");
          }
          if (data.options > 0) {
            resources.push("OPTION");
          }
          if ((data.items + data.options) > 1) {
            var dialogData: ConfirmDialogModel = {
              title: "Shared Option",
              message: 'this Option is shared in another category, add-on group or menu. Do you want to activate on all of them ?',
              showCancel: true
            };
            var dialogRef = this.dialog.open(ConfirmDialogComponent, {
              maxWidth: "80vw",
              data: dialogData
            });
            dialogRef.afterClosed().subscribe(
              (ok) => {
                if (ok) {
                  this.productSvc.putApiProductIdStatus(<ProductService.PutApiProductIdStatusParams>{
                    id: productId,
                    resources: resources,
                    status: status
                  }).subscribe(
                    (data2) => {
                      resolve();
                    }, (err) => {
                      reject
                    }
                  );
                }
              }, (err) => {
                reject();
              }
            );
          } else {
            this.optionSvc.putApiOptionStatus(<OptionService.PutApiOptionStatusParams>{
              options: [itemId],
              productId: productId,
              status: status
            }).subscribe(
              (data2) => {
                resolve();
              }, (err) => {
                reject
              }
            );
          }
        }
      );
    });
  }

  getProduct(id: string) {
    return new Promise<Product>((resolve, reject) => {
      this.productSvc.getApiProductId(id).subscribe(
        (data) => {
          resolve(data);
        }
      );
    });
  }

  getOptionGroup(id: string) {
    return new Promise<OptionGroup>((resolve, reject) => {
      this.optionGroupSvc.getApiOptionGroupId(id).subscribe(
        (data) => {
          resolve(data);
        }
      );
    });
  }
}
