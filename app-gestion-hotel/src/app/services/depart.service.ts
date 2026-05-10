// src/app/services/depart.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environnement';
import { DepartDuJourDTO } from '../models/Depart.model';


@Injectable({ providedIn: 'root' })
export class DepartService {

  private readonly api = `${environment.apiUrl}/departs`;
  private http = inject(HttpClient);

  /** Clients qui partent aujourd'hui (checkOut = today) */
  getDepartsDuJour(): Observable<DepartDuJourDTO[]> {
    return this.http.get<DepartDuJourDTO[]>(`${this.api}/jour`);
  }

  /**
   * Marquer le départ comme effectué :
   *  - chambre → EN_NETTOYAGE
   *  - fidélité → +1 séjour, +10 pts
   */
  marquerDepartEffectue(reservationId: number): Observable<DepartDuJourDTO> {
    return this.http.patch<DepartDuJourDTO>(
      `${this.api}/${reservationId}/effectue`, {}
    );
  }
}