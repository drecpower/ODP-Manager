import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaSizeEditorComponent } from './pizza-size-editor.component';

describe('PizzaSizeEditorComponent', () => {
  let component: PizzaSizeEditorComponent;
  let fixture: ComponentFixture<PizzaSizeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PizzaSizeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PizzaSizeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
