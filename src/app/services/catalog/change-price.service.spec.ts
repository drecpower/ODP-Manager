import { TestBed } from '@angular/core/testing';

import { ChangePriceService } from './change-price.service';

describe('ChangePriceService', () => {
  let service: ChangePriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangePriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
