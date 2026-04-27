import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    console.log('🔐 [AuthInterceptor] Token:', token ? 'Présent ✅' : 'Absent ❌');
    console.log('🔗 [AuthInterceptor] URL:', request.url);

    // Ajouter le token si disponible
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ [AuthInterceptor] Token ajouté au header');
    } else {
      console.warn('⚠️ [AuthInterceptor] Pas de token disponible');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ [AuthInterceptor] Erreur HTTP:', error.status, error.message);
        
        if (error.status === 401) {
          // Token expiré ou invalide
          console.warn('🔄 [AuthInterceptor] Token expiré. Déconnexion...');
          this.authService.logout();
          this.router.navigate(['/connexion']);
        }
        return throwError(() => error);
      })
    );
  }
}