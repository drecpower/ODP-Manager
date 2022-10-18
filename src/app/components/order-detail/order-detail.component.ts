import { Order } from '../../api/models/order';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { OrderService } from 'src/app/api/services';
import { OrderStyleDefinition } from 'src/app/shared/order/order-style-definition';
import { DtoOrderDetails } from 'src/app/api/models';
import { getCurrencySymbol, getLocaleCurrencySymbol } from '@angular/common';
import { SystemService } from 'src/app/services/system.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DtoStoredOrder } from 'src/app/services/integrator/dto-stored-order';


@Component({
  selector: 'app-order-detail',  
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {
  @Input() storedOrder: DtoStoredOrder;
  @Output() changeStatusEvent = new EventEmitter();
  @Output() closeEvent = new EventEmitter();

  changing: boolean = false;
  public readonly osd = OrderStyleDefinition.osd;
  constructor(private orderSvc: OrderService, public systemSvc: SystemService,
    public breakpointObserver: BreakpointObserver,
    @Inject(LOCALE_ID) public locale: string) {
    this.isHandset$.subscribe(d => {
      this._isHandset = d;
    });
  }

  close() {
    this.closeEvent.next(true);
  }

  _isHandset = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit() {
    console.log("PIZZA");
    console.log(this.storedOrder);
    var i = this.storedOrder;
  }

  getCurrencySymbol() {
    return getLocaleCurrencySymbol(this.locale);
  }

  changeStatus(idStoredOrder: string, status: string) {
    var _self = this;
    _self.changeStatusEvent.emit({ idStoredOrder: idStoredOrder, status: status });
  }

  getTime() {
    //return this.timeDiffCalc(new Date(), new Date(this.order.modifiedAt));
  }
  timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    //console.log('calculated days', days);

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    //console.log('calculated hours', hours);

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    //console.log('minutes', minutes);

    let difference = '';
    if (days > 0) {
      difference += (days === 1) ? `${days} d, ` : `${days} d, `;
    }

    if (hours > 0)
      difference += (hours === 0 || hours === 1) ? `${hours} hr, ` : `${hours} hr, `;

    difference += (minutes === 0 || hours === 1) ? `${minutes} min` : `${minutes} min`;

    return difference;
  }
}
