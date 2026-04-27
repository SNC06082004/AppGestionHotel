import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environnement';
import { Client } from '../models/Client.model';
import { ComplaintRequest, ComplaintResponse } from '../models/complaint.model';



@Injectable({
  providedIn: 'root'
})
export class PlaintesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ Accepte ComplaintRequest pour créer
  createPlainte(complaint: ComplaintRequest): Observable<ComplaintResponse> {
    return this.http.post<ComplaintResponse>(`${this.apiUrl}/complaints`, complaint);
  }

  // ✅ Retourne ComplaintResponse
  getPlaintes(): Observable<ComplaintResponse[]> {
    return this.http.get<ComplaintResponse[]>(`${this.apiUrl}/complaints`);
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  // ✅ Accepte ComplaintRequest pour mettre à jour
  updatePlainte(id: string, complaint: ComplaintRequest): Observable<ComplaintResponse> {
    return this.http.put<ComplaintResponse>(`${this.apiUrl}/complaints/${id}`, complaint);
  }

  deletePlainte(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/complaints/${id}`);
  }
}