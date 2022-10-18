import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/api/models';

@Component({
  selector: 'app-item-availability',
  templateUrl: './item-availability.component.html',
  styleUrls: ['./item-availability.component.scss']
})
export class ItemAvailabilityComponent implements OnInit {
  @Input() item:Item;
  constructor() { }

  ngOnInit(): void {
  }

}
