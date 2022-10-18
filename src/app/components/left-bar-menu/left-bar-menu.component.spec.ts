import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftBarMenuComponent } from './left-bar-menu.component';

describe('LeftBarMenuComponent', () => {
  let component: LeftBarMenuComponent;
  let fixture: ComponentFixture<LeftBarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftBarMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftBarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
