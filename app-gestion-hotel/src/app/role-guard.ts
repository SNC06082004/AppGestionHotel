import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    const isLoggedIn = this.authService.isLoggedIn();

    // Vérifier si l'utilisateur est connecté
    if (!isLoggedIn || !currentUser) {
      this.router.navigate(['/connexion']);
      return false;
    }

    // Vérifier les rôles requis pour cette route
    const requiredRoles = route.data['roles'] as string[];
    
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = this.authService.getAppRole(currentUser);

      if (!userRole) {
        console.warn(`Profil sans rôle exploitable — redirection connexion (${state.url})`);
        this.authService.logout();
        this.router.navigate(['/connexion']);
        return false;
      }

      if (!requiredRoles.includes(userRole)) {
        console.warn(`Accès refusé. Rôle ${userRole} non autorisé pour ${state.url}`);
        this.router.navigate(['/accueil']);
        return false;
      }
    }

    return true;
  }
}
