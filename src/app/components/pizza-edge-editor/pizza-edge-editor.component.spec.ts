import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaEdgeEditorComponent } from './pizza-edge-editor.component';

describe('PizzaEdgeEditorComponent', () => {
  let component: PizzaEdgeEditorComponent;
  let fixture: ComponentFixture<PizzaEdgeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PizzaEdgeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PizzaEdgeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
