import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly API = 'http://localhost:8080/api/reservations';
  private http = inject(HttpClient);

  getFourchettePrix(type: string): Observable<{min: number, max: number}> {
    return this.http.get<any>(`${this.API}/fourchette-prix/${type}`);
  }

  checkDisponibilite(type: string, capacite: number, checkIn: string, checkOut: string): Observable<any> {
    return this.http.get<any>(`${this.API}/check-disponibilite`, {
      params: { type, capacite: String(capacite), checkIn, checkOut }
    });
  }

  creerReservation(data: any): Observable<any> {
    return this.http.post<any>(`${this.API}/creer`, data);
  }
}