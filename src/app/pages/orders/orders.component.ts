import { element } from 'protractor';
import { DtoStoredOrder } from '../../services/integrator/dto-stored-order';
import { DtoOrderDetails } from './../../api/models/dto-order-details';
import { DtoOrderStatus } from 'src/app/shared/order/dto-order-status';
import { DtoOrderStatusGroup } from '../../shared/order/dto-order-status-group';
import { DtoEvent } from './../../api/models/dto-event';
import { FormControl, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { OrderService } from 'src/app/api/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderStyleDefinition } from 'src/app/shared/order/order-style-definition';
import { IntegratorService } from 'src/app/services/integrator/integrator.service';
import * as Enumerable from 'linq';
import { animSlideInOutAnimation } from 'src/app/shared/animations';
import { SystemService } from 'src/app/services/system.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    animSlideInOutAnimation
  ]
})
export class OrdersComponent implements OnInit, OnDestroy {

  public static readonly IMMEDIATE: string = "IMMEDIATE";
  public static readonly SCHEDULED: string = "SCHEDULED";
  public readonly osd = OrderStyleDefinition.osd;
  ComboFilters = new FormControl();
  filters: any = [{
    tipo: "Order status",
    lst: [{ label: "Pending", value: "PLC" },
    { label: "On Delivery", value: "DSP" }
    ]
  }];

  selectedOrderStatus: DtoOrderStatus = null;
  selectedStoredOrder: DtoStoredOrder = null;
  listOrderStatusGroup: DtoOrderStatusGroup[] = [];
  orderTimingSelected: string = OrdersComponent.IMMEDIATE;
  first: boolean = false;
  starting: boolean = false;
  modalCancelled: boolean = false;
  currentId: string = "";
  constructor(private orderSvc: OrderService, public integratorSvc: IntegratorService, public systemSvc: SystemService,
    public route: ActivatedRoute,
    public router: Router,
    public breakpointObserver: BreakpointObserver) {

    this.isHandset$.subscribe(d => {
      this._isHandset = d;
    });

    this.route.params.subscribe(
      (params) => {
        if (params.id) {
          this.currentId = params.id;
          this.selectOrderById(params.id);
        } else {
          this.selectOrder(null);
        }
      }
    )
  }


  _isHandset = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  ngOnDestroy(): void {
    this.integratorSvc.stopPooling();
  }

  ngOnInit(){
    if (this.integratorSvc.initialized){
      this.initialize();
    } else {
      this.integratorSvc.onInitialized.subscribe(d=>{
        if (d){
          this.initialize();
        }
      })
    }
  }

  initialize() {
    try {
      var _self = this;
      this.starting = true;
      this.mountList(this.integratorSvc.listOrder);
      if (this.starting) {
        if (this.listOrderStatusGroup.length > 0 && this.listOrderStatusGroup[0].dtoOrderStatus.length > 0) {
          this.starting = false;
          setTimeout(() => {
            if (this.currentId) {
              this.selectOrderById(this.currentId);
            } else {
              this.selectOrder(this.listOrderStatusGroup[0].dtoOrderStatus[0]);
            }


          }, 100);
        }
      }
      this.integratorSvc.onAddedOrder.subscribe(
        (sO) => {
          var group = Enumerable.from(this.listOrderStatusGroup).where(x => x.status == sO.status).firstOrDefault();
          if (group == null) {
            var group = <DtoOrderStatusGroup>{
              qtd: 1,
              status: sO.status,
              dtoOrderStatus: []
            };
            this.listOrderStatusGroup.push(group);
          }
          group.dtoOrderStatus.push(<DtoOrderStatus>{
            storedOrder: sO,
            alert: null
          });
        },
        (error) => {

        });
      this.integratorSvc.onUpdatedOrder.subscribe(
        (sO) => {

          var OldGroup = Enumerable.from(this.listOrderStatusGroup).where(
            x => Enumerable.from(x.dtoOrderStatus).where(y => y.storedOrder.order.id == sO.order.id).any()
          ).select(s => s).firstOrDefault();
          if (OldGroup != null) {
            var os = Enumerable.from(OldGroup.dtoOrderStatus).where(x => x.storedOrder.order.id == sO.order.id).firstOrDefault();
            OldGroup.dtoOrderStatus.splice(OldGroup.dtoOrderStatus.indexOf(os), 1);
            if (OldGroup.dtoOrderStatus.length == 0) {
              this.listOrderStatusGroup.splice(this.listOrderStatusGroup.indexOf(OldGroup), 1);
            }
          }

          var newGroup = Enumerable.from(this.listOrderStatusGroup).where(x => x.status == sO.status).firstOrDefault();

          if (newGroup == null) {
            newGroup = <DtoOrderStatusGroup>{
              qtd: 1,
              status: sO.status,
              dtoOrderStatus: [<DtoOrderStatus>{
                storedOrder: sO,
                alert: null
              }]
            };
            this.listOrderStatusGroup.push(newGroup);
          } else {
            var os = Enumerable.from(newGroup.dtoOrderStatus).where(x => x.storedOrder.order.id == sO.order.id).firstOrDefault();
            if (os == null) {
              newGroup.dtoOrderStatus.push(<DtoOrderStatus>{ storedOrder: sO });
            } else {
              newGroup.dtoOrderStatus[newGroup.dtoOrderStatus.indexOf(os)] = <DtoOrderStatus>{ storedOrder: sO };
            }
          }
        },
        (error) => {

        });
      this.integratorSvc.onDeletedOrder.subscribe(
        (sO) => {
          var OldGroup = Enumerable.from(this.listOrderStatusGroup).where(
            x => Enumerable.from(x.dtoOrderStatus).where(y => y.storedOrder.order.id == sO.order.id).any()
          ).select(s => s).firstOrDefault();
          if (OldGroup != null) {
            var element = Enumerable.from(OldGroup.dtoOrderStatus).where(x => x.storedOrder.order.id == sO.order.id).firstOrDefault();
            OldGroup.dtoOrderStatus.splice(OldGroup.dtoOrderStatus.indexOf(element), 1);
            if (OldGroup.dtoOrderStatus.length == 0) {
              this.listOrderStatusGroup.splice(this.listOrderStatusGroup.indexOf(OldGroup), 1);
            }
          }
        },
        (error) => {

        });

    } catch (error) {
    }
  }

  selectOrderById(currentId: string) {
    var storedOrder = Enumerable.from(this.listOrderStatusGroup)
      .select(
        losgp => Enumerable.from(losgp.dtoOrderStatus)
          .where(os => os.storedOrder.id == currentId)
          .select(p => p).defaultIfEmpty(null).firstOrDefault()
      )
      .where(p => p != null)
      .defaultIfEmpty(null)
      .firstOrDefault();

    if (storedOrder?.storedOrder && this.selectedStoredOrder != storedOrder.storedOrder) {
      this.selectOrder(storedOrder)
    }
  }

  async changeStatus(osc) {
    try {
      await this.integratorSvc.changeStatus(osc.idStoredOrder, osc.status);
      this.selectOrder(null);
    } catch (error) {
      console.dir(error);
    }
  }
  selectOrder(os: DtoOrderStatus) {
    if (os != null && this.selectedStoredOrder != os.storedOrder) {
      this.selectedOrderStatus = null;
      this.selectedStoredOrder = null;
      setTimeout(() => {
        this.selectedOrderStatus = os;
        this.selectedStoredOrder = os.storedOrder;
        this.router.navigateByUrl("/orders/" + os.storedOrder.id);
      }, 100);

    } else {
      this.selectedStoredOrder = null;
      this.selectedOrderStatus = null;
      this.router.navigateByUrl("/orders/");
    }

  }
  mountList(storedOrders: DtoStoredOrder[] | undefined = undefined) {
    var lstIndex = {};

    if (storedOrders == undefined) {
      storedOrders = this.integratorSvc.listOrder;
    }
    var lstDtoOrderStatusGroup: DtoOrderStatusGroup[] = [
      <DtoOrderStatusGroup>{ qtd: 0, status: "OWO", dtoOrderStatus: [] },
      <DtoOrderStatusGroup>{ qtd: 0, status: "PLC", dtoOrderStatus: [] },
      <DtoOrderStatusGroup>{ qtd: 0, status: "DSP", dtoOrderStatus: [] },
      <DtoOrderStatusGroup>{ qtd: 0, status: "RTP", dtoOrderStatus: [] },
      <DtoOrderStatusGroup>{ qtd: 0, status: "CAN", dtoOrderStatus: [] },
      <DtoOrderStatusGroup>{ qtd: 0, status: "CON", dtoOrderStatus: [] },
    ];
    for (let i = 0; i < lstDtoOrderStatusGroup.length; i++) {
      lstIndex[lstDtoOrderStatusGroup[i].status] = i;
    }

    for (let i = 0; i < storedOrders.length; i++) {
      const element = storedOrders[i];
      if (lstIndex[storedOrders[i].status] != null) {
        lstDtoOrderStatusGroup[lstIndex[storedOrders[i].status]].qtd++;
        lstDtoOrderStatusGroup[lstIndex[storedOrders[i].status]].dtoOrderStatus.push(<DtoOrderStatus>{ storedOrder: storedOrders[i] });
      } else {
        var dtoOg = <DtoOrderStatusGroup>{
          qtd: 1,
          status: storedOrders[i].status,
          dtoOrderStatus: [<DtoOrderStatus>{ storedOrder: storedOrders[i] }]
        };
        lstIndex[storedOrders[i].status] = lstDtoOrderStatusGroup.length;
        lstDtoOrderStatusGroup.push(dtoOg);
      }
    }
    this.listOrderStatusGroup = lstDtoOrderStatusGroup;
  }
  addGroup() {

  }
  checkCancelleds() {

  }
}
