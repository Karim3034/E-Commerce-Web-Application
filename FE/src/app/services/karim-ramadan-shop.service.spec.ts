import { TestBed } from '@angular/core/testing';

import { KarimRamadanShopFormService } from './karim-ramadan-shop-form.service';

describe('KarimRamadanShopService', () => {
  let service: KarimRamadanShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KarimRamadanShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
