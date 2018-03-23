import { TestBed, inject } from '@angular/core/testing';

import { UiStatesService } from './ui-states.service';

describe('UiStatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiStatesService]
    });
  });

  it('should be created', inject([UiStatesService], (service: UiStatesService) => {
    expect(service).toBeTruthy();
  }));
});
