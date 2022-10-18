import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from 'src/app/api/models/item';

@Injectable({
  providedIn: 'root'
})
export class ChangePriceService {
  objChangingPrice: { id: string, price: number, type: string } | undefined;
  changingPrice: number = 0;
  itemsToChangePrice: any = {};
  private _onSavePricesSubject = new Subject<any>();
  public onSavePrices = this._onSavePricesSubject.asObservable();
  public hasChanges:boolean = false;
  constructor() { }
  //todo onSavePrices();
  changeItemPrice(item: Item) {
    this.objChangingPrice = {
      id: item.id,
      price: item.price,
      type: 'item'
    };
    if (!this.itemsToChangePrice[item.id]) {
      this.changingPrice = item.price;
    } else {
      this.changingPrice = this.itemsToChangePrice[item.id];
    }
  }
  changedPrice() {
    if (this.objChangingPrice.price != this.changingPrice) {
      this.itemsToChangePrice[this.objChangingPrice.id] = this.changingPrice;
      this.hasChanges =true;
    } else {
      if (this.itemsToChangePrice[this.objChangingPrice.id]) {
        delete this.itemsToChangePrice[this.objChangingPrice.id];
        if(!(Object.keys(this.itemsToChangePrice).length>0)){
          this.hasChanges=false;
        }
      }
    }
  }
  blurItem(id) {
    if (this.objChangingPrice && this.objChangingPrice.type == 'item' && this.objChangingPrice.id == id) {
      try {
        // delete this.itemsToChangePrice[this.objChangingPrice.id];
      } catch (error) {

      }
      this.objChangingPrice = undefined;
      this.changingPrice = 0;
    }
  }
  discard(){
  this.objChangingPrice=undefined;
  this.changingPrice =0;
  this.itemsToChangePrice={};
  this.hasChanges = false;
  }
  save(){
    for (let i = 0; i < Object.keys(this.itemsToChangePrice).length; i++) {
      const id = Object.keys(this.itemsToChangePrice)[i];
      var price = this.itemsToChangePrice[id];

      
    }
    this.hasChanges=false;
  }
}
