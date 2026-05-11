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

  /** Rôle métier attendu par RoleGuard / navbar (ADMIN, CLIENT, …). */
  getAppRole(user: any): string | null {
    if (!user || typeof user !== 'object') return null;
    let r = user.userType ?? user.role;
    if (typeof r !== 'string') return null;
    const t = r.trim();
    if (!t) return null;
    return t.startsWith('ROLE_') ? t.slice(5) : t;
  }

  private readRoleFromJwt(token: string): string | null {
    try {
      let base64 = token.split('.')[1];
      if (!base64) return null;
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      if (pad) base64 += '='.repeat(4 - pad);
      const payload = JSON.parse(atob(base64));
      const r = payload.role;
      if (typeof r !== 'string') return null;
      return r.startsWith('ROLE_') ? r.slice(5) : r;
    } catch {
      return null;
    }
  }

  private normalizeUserPayload(raw: any): any {
    if (!raw || typeof raw !== 'object') return raw;
    let role = this.getAppRole(raw);
    if (!role) {
      const token = localStorage.getItem('token');
      if (token) role = this.readRoleFromJwt(token);
    }
    return role ? { ...raw, userType: role } : { ...raw };
  }

  // Récupérer l'utilisateur stocké dans localStorage
  private getUserFromStorage(): any {
    const user = localStorage.getItem('currentUser');
    if (!user) return null;
    try {
      const parsed = JSON.parse(user);
      const normalized = this.normalizeUserPayload(parsed);
      if (normalized?.userType && normalized.userType !== parsed?.userType) {
        localStorage.setItem('currentUser', JSON.stringify(normalized));
      }
      return normalized;
    } catch {
      return null;
    }
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
        const user = this.normalizeUserPayload(response.user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
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
        const user = this.normalizeUserPayload(response.user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
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
    const u = this.currentUserSubject.value;
    if (!u) return null;
    const role = this.getAppRole(u);
    if (!role && this.getToken()) {
      const fixed = this.normalizeUserPayload(u);
      if (fixed?.userType) {
        localStorage.setItem('currentUser', JSON.stringify(fixed));
        this.currentUserSubject.next(fixed);
        return fixed;
      }
    }
    return u;
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

