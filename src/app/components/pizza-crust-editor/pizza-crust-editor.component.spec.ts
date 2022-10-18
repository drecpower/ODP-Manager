import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaCrustEditorComponent } from './pizza-crust-editor.component';

describe('PizzaCrustEditorComponent', () => {
  let component: PizzaCrustEditorComponent;
  let fixture: ComponentFixture<PizzaCrustEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PizzaCrustEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PizzaCrustEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
