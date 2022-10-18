import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MffUploadFileComponent } from './mff-upload-file.component';

describe('MffUploadFileComponent', () => {
  let component: MffUploadFileComponent;
  let fixture: ComponentFixture<MffUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MffUploadFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MffUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
