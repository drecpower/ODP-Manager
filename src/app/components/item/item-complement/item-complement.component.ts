import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/api/models'; 

@Component({
  selector: 'app-item-complement',
  templateUrl: './item-complement.component.html',
  styleUrls: ['./item-complement.component.scss']
})
export class ItemComplementComponent implements OnInit {
  @Input() item:Item;

  constructor() { }

  ngOnInit(): void {
  }

}
