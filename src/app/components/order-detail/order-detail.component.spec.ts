import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDetailComponent } from './order-detail.component';

describe('OrdersDetailComponent', () => {
  let component: OrdersDetailComponent;
  let fixture: ComponentFixture<OrdersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
