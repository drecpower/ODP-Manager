import { TestBed } from '@angular/core/testing';

import { IntegratorService } from './integrator.service';

describe('IntegratorService', () => {
  let service: IntegratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
