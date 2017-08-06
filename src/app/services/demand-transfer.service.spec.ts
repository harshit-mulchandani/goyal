import { TestBed, inject } from '@angular/core/testing';

import { DemandTransferService } from './demand-transfer.service';

describe('DemandTransferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemandTransferService]
    });
  });

  it('should be created', inject([DemandTransferService], (service: DemandTransferService) => {
    expect(service).toBeTruthy();
  }));
});
