import { TestBed } from '@angular/core/testing';

import { CryptoWsService } from './crypto-ws.service';

describe('CryptoWsService', () => {
  let service: CryptoWsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoWsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
