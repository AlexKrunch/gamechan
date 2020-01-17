import { TestBed, inject } from '@angular/core/testing';

import { OfflineService } from './offline.service';

describe('OfflineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfflineService]
    });
  });

  it('should be created', inject([OfflineService], (service: OfflineService) => {
    expect(service).toBeTruthy();
  }));
});
