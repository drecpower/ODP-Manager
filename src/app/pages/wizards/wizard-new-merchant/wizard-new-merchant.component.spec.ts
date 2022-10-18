import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardNewMerchantComponent } from './wizard-new-merchant.component';

describe('WizardNewMerchantComponent', () => {
  let component: WizardNewMerchantComponent;
  let fixture: ComponentFixture<WizardNewMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardNewMerchantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardNewMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
