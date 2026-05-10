// src/app/services/fidelite.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environnement';
import { CarteFideliteDTO, AjoutPointsRequest } from '../models/Fidelite.model';


@Injectable({ providedIn: 'root' })
export class FideliteService {

  private readonly api = `${environment.apiUrl}/fidelite`;
  private http = inject(HttpClient);

  /** Toutes les cartes (triées par points décroissants) */
  getAllCartes(): Observable<CarteFideliteDTO[]> {
    return this.http.get<CarteFideliteDTO[]>(this.api);
  }

  /** Carte d'un client spécifique */
  getCarteByClient(clientId: number): Observable<CarteFideliteDTO> {
    return this.http.get<CarteFideliteDTO>(`${this.api}/client/${clientId}`);
  }

  /**
   * Récupère la carte du client ou en crée une si elle n'existe pas.
   * Utile pour l'affichage sans avoir à gérer le 404.
   */
  getOuCreerCarte(clientId: number): Observable<CarteFideliteDTO> {
    return this.http.get<CarteFideliteDTO>(`${this.api}/client/${clientId}/ou-creer`);
  }

  /** Ajouter des points à un client */
  ajouterPoints(clientId: number, points: number): Observable<CarteFideliteDTO> {
    const body: AjoutPointsRequest = { points };
    return this.http.post<CarteFideliteDTO>(
      `${this.api}/client/${clientId}/points`, body
    );
  }
}