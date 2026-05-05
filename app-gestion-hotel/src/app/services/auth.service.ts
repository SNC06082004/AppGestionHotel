import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environnement';
import { 
  InscriptionRequest, 
  LoginRequest, 
  AuthResponse,
  InscriptionResponse,
  LoginResponse
} from '../models/Client.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Récupérer l'utilisateur stocké dans localStorage
  private getUserFromStorage(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Inscription
  inscrire(payload: InscriptionRequest): Observable<InscriptionResponse> {
    return this.http.post<InscriptionResponse>(
      `${this.apiUrl}/auth/register`, 
      {
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.email,
        telephone: payload.telephone,
        motDePasse: payload.motDePasse
      }
    ).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  // Connexion
  connexion(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Récupérer l'utilisateur actuellement connecté
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

