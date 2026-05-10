import { TestBed } from '@angular/core/testing';
import { FideliteService } from './fidelite.service';

describe('FideliteService', () => {
  let service: FideliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FideliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
