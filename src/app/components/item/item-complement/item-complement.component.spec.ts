import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComplementComponent } from './item-complement.component';

describe('ItemComplementComponent', () => {
  let component: ItemComplementComponent;
  let fixture: ComponentFixture<ItemComplementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemComplementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComplementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
