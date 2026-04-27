// services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environnement';
import { InscriptionRequest, InscriptionResponse } from '../models/Client.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  inscrire(data: InscriptionRequest): Observable<InscriptionResponse> {
    return this.http.post<InscriptionResponse>(
      `${this.apiUrl}/auth/inscription`,
      data
    );
  }
}