import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SystemService } from 'src/app/services/system.service';
import { OrderStyleDefinition } from 'src/app/shared/order/order-style-definition';
import { DtoOrderStatus } from '../../shared/order/dto-order-status';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.less']
})
export class OrderStatusComponent implements OnInit {
  @Input() orderStatus: DtoOrderStatus;
  @Input() selected: boolean;
  @Output() changeStatusEvent = new EventEmitter();

  public readonly osd = OrderStyleDefinition.osd;
  constructor(public systemSvc: SystemService) { }

  ngOnInit(): void {
  }
  acceptCancellation() {
    this.changeStatusEvent.emit({ idStoredOrder: this.orderStatus.storedOrder.id, status: "acceptCancellation" });
  }
  denyCancellation() {
    this.changeStatusEvent.emit({ idStoredOrder: this.orderStatus.storedOrder.id, status: "denyCancellation" });

  }
}
