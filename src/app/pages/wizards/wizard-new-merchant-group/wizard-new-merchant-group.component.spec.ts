import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardNewMerchantGroupComponent } from './wizard-new-merchant-group.component';

describe('WizardNewMerchantGroupComponent', () => {
  let component: WizardNewMerchantGroupComponent;
  let fixture: ComponentFixture<WizardNewMerchantGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardNewMerchantGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardNewMerchantGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
