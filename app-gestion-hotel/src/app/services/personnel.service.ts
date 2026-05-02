import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonnelService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/personnel';

  getAllPersonnel(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  getByType(type: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/by-type/${type}`);
  }

  getCleaningStaff(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/cleaning`);
  }

  getMaintenanceStaff(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/maintenance`);
  }
}