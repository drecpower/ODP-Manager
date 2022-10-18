import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category, Item, OptionGroup, OptionGroupProduct, Product } from 'src/app/api/models';
import { CategoryService } from 'src/app/api/services';
import { CatalogDataService } from 'src/app/services/catalog/catalog-data.service';
import { SystemService } from 'src/app/services/system.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit {

  optionGroupProducts: OptionGroupProduct[] = [
    {
      //id: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
      min: 1,
      max: 1,
      status: "AVAILABLE",
      acceptedFractions: "1",
      slices: "1",
      //optionGroupId: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
      //productId: "ab91c4a9-103f-43b8-a42c-105c0379e571",
      optionGroupIdNavigation: {
        //id: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
        name: "SMALL",
        status: "AVAILABLE",
        type: "FLAVOR",
        createdAt: "2022-06-03T09:09:33",
        merchantId: "55d0e3fb-f932-11eb-b388-000d3a8abda5",
        merchantIdNavigation: null,
        option: [],
      }
    },
    {
      //id: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
      min: 1,
      max: 2,
      status: "AVAILABLE",
      acceptedFractions: "1,2",
      slices: "6",
      //optionGroupId: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
      //productId: "ab91c4a9-103f-43b8-a42c-105c0379e571",
      optionGroupIdNavigation: {
        //id: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
        name: "MEDIUM",
        status: "AVAILABLE",
        type: "FLAVOR",
        createdAt: "2022-06-03T09:09:33",
        merchantId: "55d0e3fb-f932-11eb-b388-000d3a8abda5",
        merchantIdNavigation: null,
        option: [],
      }
    },
    {
      //id: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
      min: 1,
      max: 3,
      status: "AVAILABLE",
      acceptedFractions: "1,2,3",
      slices: "8",
      //optionGroupId: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
      //productId: "ab91c4a9-103f-43b8-a42c-105c0379e571",
      optionGroupIdNavigation: {
        //id: "b3b40565-d6d6-44a9-8919-fcacfc1eeef4",
        name: "BIG",
        status: "AVAILABLE",
        type: "FLAVOR",
        createdAt: "2022-06-03T09:09:33",
        merchantId: "55d0e3fb-f932-11eb-b388-000d3a8abda5",
        merchantIdNavigation: null,
        option: [],
      }
    }];

  choosingTemplate: boolean = true;
  loadSizePizza: boolean = false;
  loadSave: boolean = false;
  tmpName: string = "";
  itemPizza: Item;
  productPizza: Product;
  currentTab: string = 'Details';
  listTabs: string[] = ["Details", "Sizes", "Crusts", "Edges"];
  constructor(public dialogRef: MatDialogRef<CategoryEditorComponent>,
    private systemSvc: SystemService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public category: Category,
    private categorySvc: CategoryService, private catalogDataSvc: CatalogDataService) {
    this.tmpName = category.name;
    if (category.id) {
      this.choosingTemplate = false;
    }
    this.loadTempletePizza()
  }

  loadTempletePizza() {
    var _self = this;
    if (_self.category.template == 'PIZZA' && this.category.id) {
      _self.loadSizePizza = true;
      _self.catalogDataSvc.getItemByCategory(_self.category.id).then(function (d) {
        if (d) {
          _self.itemPizza = d[0]; 
          if (_self.itemPizza.id)
            _self.catalogDataSvc.getProduct(_self.itemPizza.productId).then(function (p) {
              _self.productPizza = p;
              for (let i = 0; i < _self.productPizza.optionGroupProduct.length; i++) {
                _self.catalogDataSvc.getOptionGroup(_self.productPizza.optionGroupProduct[i].optionGroupId).then(function (d) {
                  _self.productPizza.optionGroupProduct[i].optionGroupIdNavigation = d;
                  if (_self.productPizza.optionGroupProduct.length > 0) {
                    _self.optionGroupProducts = _self.productPizza.optionGroupProduct;
                  }
                  if (i == (_self.productPizza.optionGroupProduct.length - 1)) {
                    _self.loadSizePizza = false;
                  }
                }, function (e) {
                  _self.loadSizePizza = false;
                  console.log(e);
                });
              }
            }, function (e) {
              _self.loadSizePizza = false;
              console.log(e);
            });
        }
      }, function (e) {
        _self.loadSizePizza = false;
        console.log(e);
      });
    }
  }

  ngOnInit(): void {

  }

  chooseOption(template: string) {
    this.choosingTemplate = false;
    this.category.template = template;
    this.category.status = 'AVAILABLE';
  }

  setTab(name: string) {
    if (this.category.id) {
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
    var ret = _self.checkContinue();
    if (ret == "") {
      if (this.category.template == 'PIZZA') {
        var idx = this.listTabs.indexOf(this.currentTab);
        var newIdx = idx + 1;
        if ((newIdx <= (this.listTabs.length - 1)) && !(this.category.id != undefined && this.category.id != null && this.category.id != "")) {
          this.currentTab = this.listTabs[newIdx];
        } else {
          console.info('save category');
          console.dir(this.category);
          this.save();
        }
      } else {
        this.save();
      }
    } else {
      this.openDialog(ret);
    }
  }

  checkContinue() {
    var ret = "";
    if (this.category.template == 'PIZZA') {
      for (let i = 0; i < this.optionGroupProducts.length; i++) {
        if (this.optionGroupProducts[i].optionGroupIdNavigation.name == "") {
          ret = "Fill in the name size field";
        }
        if (ret == "" && parseInt(this.optionGroupProducts[i].slices) <= 0) {
          ret = "Number of pieces must be greater than 0";
        }
      }

    }
    return ret;
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

  async save() {
    var _self = this;
    _self.loadSave = true;
    //TODO: Before saving individually save crust, edge, sizes if necessary
    try {
      var ret = await this.catalogDataSvc.saveCategory(this.category).then(function (d) {
        if (d && _self.category.template == 'PIZZA') {
          var product: Product;
          if (_self.productPizza && _self.productPizza.id) {
            product = _self.productPizza
          }
          else {
            product = {
              name: "Pizza",
              status: "AVAILABLE",
              merchantGroupId: _self.systemSvc.selectedMerchantGroup.id
            }
          }
          product.option = [];
          product.optionGroupProduct = [];
          _self.catalogDataSvc.saveProduct(product).then(function (p) {
            if (p) {
              var item: Item;
              if (_self.itemPizza && _self.itemPizza.id) {
                item = _self.itemPizza
              }
              else {
                item = {
                  price: 0,
                  status: "AVAILABLE",
                  categoryId: _self.category.id,
                  productId: p.id,
                }
              }
              _self.catalogDataSvc.saveItem(item).then(function (it) {
                if (it) {
                  var og: OptionGroup;
                  for (let i = 0; i < _self.optionGroupProducts.length; i++) {
                    _self.optionGroupProducts[i].productId = item.productId;
                    _self.optionGroupProducts[i].slices = _self.optionGroupProducts[i].slices.toString();
                    _self.optionGroupProducts[i].max = _self.getMaxOptionGroupProducts(_self.optionGroupProducts[i].acceptedFractions);
                    og = _self.optionGroupProducts[i].optionGroupIdNavigation;
                    _self.optionGroupProducts[i].optionGroupIdNavigation = null;
                    og.optionGroupProduct = [];
                    og.optionGroupProduct.push(_self.optionGroupProducts[i]);
                    og.merchantId = _self.catalogDataSvc.catalog.merchantId;
                    try {
                      _self.catalogDataSvc.saveOptionGroup(og).then(function (retOg) {
                        if (retOg) {
                          var idx = _self.optionGroupProducts.indexOf(og.optionGroupProduct[0]);
                          if (idx >= 0) {
                            var ogpNew = retOg.optionGroupProduct[0];
                            ogpNew.optionGroupIdNavigation = retOg;
                            ogpNew.optionGroupIdNavigation.optionGroupProduct = [];

                            _self.optionGroupProducts[idx] = ogpNew;
                            // retOg.optionGroupProduct[0];
                            // _self.optionGroupProducts[idx].optionGroupIdNavigation = retOg;
                            // _self.optionGroupProducts[idx].optionGroupIdNavigation.optionGroupProduct = [];
                          }
                          _self.dialogRef.close(_self.category);
                          _self.loadSave = false;
                        }
                      }, function () {
                        _self.loadSave = false;
                      });
                    } catch (error) {
                      _self.loadSave = false;
                      console.log(error);
                    }
                  }
                }
              }, function () {
                _self.loadSave = false;
              });
            }
          }, function () {
            _self.loadSave = false;
          });
        } else {
          _self.dialogRef.close(_self.category);
          _self.loadSave = false;
        }
      }, function () {
        _self.loadSave = false;
      });
    } catch (error) {
      _self.loadSave = false;
    }
  }
  getMaxOptionGroupProducts(acceptedFractions: string) {
    var ret = 1;
    var listAcceptedFractions = acceptedFractions.split(',').sort();
    ret = parseInt(listAcceptedFractions[listAcceptedFractions.length - 1]);
    return ret;
  }
  back() {
    this.dialogRef.close()
  }
}
