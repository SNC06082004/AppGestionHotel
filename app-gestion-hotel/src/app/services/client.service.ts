import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly API = 'http://localhost:8080/api/clients';
  private http = inject(HttpClient);

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }
}