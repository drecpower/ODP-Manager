import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionGroupProductEditorComponent } from './option-group-product-editor.component';

describe('OptionGroupProductEditorComponent', () => {
  let component: OptionGroupProductEditorComponent;
  let fixture: ComponentFixture<OptionGroupProductEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionGroupProductEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionGroupProductEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
