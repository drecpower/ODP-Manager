import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OptionGroup, OptionGroupProduct } from 'src/app/api/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pizza-size-editor',
  templateUrl: './pizza-size-editor.component.html',
  styleUrls: ['./pizza-size-editor.component.scss']
})
export class PizzaSizeEditorComponent implements OnInit {

  @Input() optionGroupProducts: OptionGroupProduct[];
  @Input() load: boolean;
  status: string = "AVAILABLE";

  newOptionGroupProduct: OptionGroupProduct = {
    min: 1,
    max: 1,
    status: "AVAILABLE",
    acceptedFractions: "1",
    slices: "1",
    optionGroupIdNavigation: {
      name: "",
      status: "AVAILABLE",
      type: "FLAVOR",
    }
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  deleteSize(optionGroupProduct) {
    var a = this.optionGroupProducts.splice(this.optionGroupProducts.indexOf(optionGroupProduct), 1);
    console.log(a);
  }

  addSize() {
    var newSize = JSON.parse(JSON.stringify(this.newOptionGroupProduct));
    this.optionGroupProducts.push(newSize);
  }

  changeQtyFlavors(optionGroupProduct: OptionGroupProduct, acceptedFraction: string) {
    var acceptedFractions: string[] = optionGroupProduct.acceptedFractions.split(',');
    if (acceptedFractions.indexOf(acceptedFraction) < 0) {
      acceptedFractions.push(acceptedFraction);
    } else {
      if (acceptedFraction != '1') {
        acceptedFractions.splice(acceptedFractions.indexOf(acceptedFraction), 1);
      }
    }
    acceptedFractions.sort();
    optionGroupProduct.acceptedFractions = acceptedFractions.toString();
    //this.optionGroupProducts[this.optionGroupProducts.indexOf(optionGroupProduct)].acceptedFractions = JSON.stringify(acceptedFractions);
  }

  getTextAcceptsFlavors(optionGroupProduct: OptionGroupProduct) {
    var ret = "";
    var acceptedFractions = optionGroupProduct.acceptedFractions.split(",");
    for (let i = 0; i < acceptedFractions.length; i++) {
      if (ret == "") {
        ret = acceptedFractions[i];
      } else {
        if ((acceptedFractions.length - 1) == i) {
          ret += " e " + acceptedFractions[i];
        } else {
          ret += ", " + acceptedFractions[i];
        }
      }

    }
    return ret;
  }

  alterStatus(optionGroupProduct: OptionGroupProduct ,status: string) {
    var _self = this;
    optionGroupProduct.status = status;
    // this.catalogDataSvc.setStatusItem(this.item.id, this.item.productId, status).then(function (d) {
    //   _self.item.status = status;
    // });
  }

  deleteConfirm(optionGroupProduct: OptionGroupProduct) {
    var dialogData: ConfirmDialogModel = {
      title: "Atention",
      message: 'This will exclude the "' + optionGroupProduct.optionGroupIdNavigation.name + '" Confirm ?',
      showCancel: true
    }
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "80vw",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(
      (ok) => {
        if (ok) {
          this.deleteSize(optionGroupProduct);
        }
      }
    );
  }
}
