/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CancionService } from './cancion.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

describe('Service: Cancion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CancionService]
    });
  });

  // it('should ...', inject([CancionService], (service: CancionService) => {
  //   expect(service).toBeTruthy();
  // }));
});
