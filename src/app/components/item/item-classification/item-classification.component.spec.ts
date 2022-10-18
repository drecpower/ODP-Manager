import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemClassificationComponent } from './item-classification.component';

describe('ItemClassificationComponent', () => {
  let component: ItemClassificationComponent;
  let fixture: ComponentFixture<ItemClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemClassificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
