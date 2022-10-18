import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Option, OptionGroupProduct, Product } from 'src/app/api/models';
import { SystemService } from 'src/app/services/system.service';
import { ItemEditorComponent } from '../../item/item-editor/item-editor.component';

@Component({
  selector: 'app-option-group-product-editor',
  templateUrl: './option-group-product-editor.component.html',
  styleUrls: ['./option-group-product-editor.component.scss']
})
export class OptionGroupProductEditorComponent implements OnInit {
  currentTab: string = "Details";
  listTabs: string[] = ["Details", "Complements"];
  editing:boolean=false;
  private _mandatory: boolean = false;
  public get mandatory(): boolean {
    return this._mandatory;
  }
  public set mandatory(v: boolean) {
    this._mandatory = v;
    if (v) {
      this.ogp.min = 1;
    } else {
      this.ogp.min = 0;
    }
  }

  constructor(public dialogRef: MatDialogRef<OptionGroupProductEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public ogp: OptionGroupProduct,private systemSvc:SystemService) {
    if (ogp.min > 0) {
      this._mandatory = true;
    }
    if(ogp.optionGroupIdNavigation.name){
      this.editing=true;
    }
  }

  ngOnInit(): void {

  }

  setTab(name: string) {
    if (this.editing) {
      this.currentTab = name;
    }
    else {
      if (this.listTabs.indexOf(name) <= this.listTabs.indexOf(this.currentTab)) {
        this.currentTab = name;
      }
    }
  }
  continue() {
    if (this.validate()) {
      var idx = this.listTabs.indexOf(this.currentTab);
      var newIdx = idx + 1;
      if (newIdx <= (this.listTabs.length - 1)) {
        this.currentTab = this.listTabs[newIdx];
        if (!(this.ogp.optionGroupIdNavigation.option && this.ogp.optionGroupIdNavigation.option.length > 0)) {
          this.ogp.optionGroupIdNavigation.option = [];
          console.log('sdf');
          this.addItemComplement();
        }else{
          
        }
      } else {
        this.dialogRef.close(this.ogp);
      }
    }
  }
  addItemComplement() {
    this.ogp.optionGroupIdNavigation.option.push(<Option>{
      price: undefined,
      status: "AVAILABLE",
      externalCode: undefined,
      productIdNavigation:<Product> {
        id: "",
        name: undefined,
        status:"AVAILABLE",
        merchantGroupId:this.systemSvc.selectedMerchantGroup.id
      }
    });
  }
  validate() {
    if (this.ogp.optionGroupIdNavigation.name == '' || this.ogp.optionGroupIdNavigation.name == undefined) {
      return false;
    }
    return true;
  }

  onDeletedOption(option:Option){
    var idx = this.ogp.optionGroupIdNavigation.option.indexOf(option);
    console.dir(idx);
    if(idx>=0){
      this.ogp.optionGroupIdNavigation.option.splice(idx,1); 
    }
  }
}
