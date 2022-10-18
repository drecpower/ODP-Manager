import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/api/models';

@Component({
  selector: 'app-item-price',
  templateUrl: './item-price.component.html',
  styleUrls: ['./item-price.component.scss']
})
export class ItemPriceComponent implements OnInit {
  @Input() item: Item;
  applyingDiscount: boolean = false;
  constructor() { 
  }
  percentage: number | undefined;
  ngOnInit(): void {
    if(this.item && this.item.originalPrice){
      this.applyingDiscount=true;
    }
  }

  applyDiscount() {

    if (this.item.originalPrice != this.item.price) {
      this.applyingDiscount = true;
      this.item.originalPrice = this.item.price;
      this.item.price = undefined;
    }
  }
  changePrice() {
    if(this.item.price){
      this.percentage = Math.floor(((this.item.originalPrice - this.item.price) / this.item.originalPrice) * 100);
    }else{
      this.item.price=0;
    }
  }
  changePercentage() {
    if(this.percentage){
      this.item.price = (1 - (this.percentage / 100)) * this.item.originalPrice;
    }else{
      this.percentage=0;
    }
  }
  removeDiscount(){
    this.item.price = this.item.originalPrice;
    this.item.originalPrice = undefined;
    this.percentage=undefined;
    this.applyingDiscount = false;
  }
}
