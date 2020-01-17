import { TestBed, inject } from '@angular/core/testing';

import { GameUiService } from './game-ui.service';

describe('GameUiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameUiService]
    });
  });

  it('should be created', inject([GameUiService], (service: GameUiService) => {
    expect(service).toBeTruthy();
  }));
});
