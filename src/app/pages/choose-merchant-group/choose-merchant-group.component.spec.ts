import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseMerchantGroupComponent } from './choose-merchant-group.component';

describe('ChooseMerchantGroupComponent', () => {
  let component: ChooseMerchantGroupComponent;
  let fixture: ComponentFixture<ChooseMerchantGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseMerchantGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseMerchantGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
