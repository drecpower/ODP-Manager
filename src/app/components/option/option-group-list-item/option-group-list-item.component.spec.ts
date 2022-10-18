import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionGroupListItemComponent } from './option-group-list-item.component';

describe('OptionGroupListItemComponent', () => {
  let component: OptionGroupListItemComponent;
  let fixture: ComponentFixture<OptionGroupListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionGroupListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionGroupListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
