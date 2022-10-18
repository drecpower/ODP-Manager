import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/api/models';

@Component({
  selector: 'app-item-classification',
  templateUrl: './item-classification.component.html',
  styleUrls: ['./item-classification.component.scss']
})
export class ItemClassificationComponent implements OnInit {
  @Input() item:Item;

  constructor() { }

  ngOnInit(): void {
  }

}
