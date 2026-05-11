import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true
})
export class NavbarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  currentUser: any = null;
  userRole: string = '';
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  /** Aucune barre (invité ou connectée) sur connexion / inscription. */
  hideNavbarOnAuthPages = false;

  /**
   * Pas d’entrée « Réservations » dans la nav pour admin / réception (accès autrement si besoin).
   */
  navItems: NavItem[] = [
    { label: 'Accueil', path: '/accueil', icon: '🏠', roles: ['CLIENT', 'PERSONNEL', 'RECEPTIONNISTE', 'ADMIN'] },
    { label: 'Plaintes & demandes', path: '/plainteetdemande', icon: '📢', roles: ['CLIENT'] },
    { label: 'Fidélité', path: '/fidelite', icon: '⭐', roles: ['CLIENT'] },
    { label: 'Gestion des clients', path: '/gestion-clients', icon: '💲', roles: ['ADMIN', 'RECEPTIONNISTE'] },
    { label: 'Administration', path: '/administration', icon: '⚙️', roles: ['ADMIN'] },
    { label: 'Affectation', path: '/dashboard', icon: '📋', roles: ['PERSONNEL','RECEPTIONNISTE'] },
  ];

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.userRole = this.authService.getAppRole(user) || '';
        } else {
          this.currentUser = null;
          this.userRole = '';
        }
      });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.syncNavbarForRoute());

    this.syncNavbarForRoute();
  }

  private syncNavbarForRoute(): void {
    const path = this.router.url.split('?')[0].split('#')[0];
    this.hideNavbarOnAuthPages = path === '/connexion' || path === '/inscription';
    if (this.hideNavbarOnAuthPages) {
      this.isDropdownOpen = false;
      this.isMobileMenuOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  getVisibleItems(): NavItem[] {
    if (!this.userRole) return [];
    return this.navItems.filter(item => item.roles.includes(this.userRole));
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.isMobileMenuOpen = false;
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/connexion']);
    this.isDropdownOpen = false;
  }

  getRoleLabel(): string {
    const labels: { [key: string]: string } = {
      'CLIENT': 'Client',
      'PERSONNEL': 'Personnel',
      'RECEPTIONNISTE': 'Réceptionniste',
      'ADMIN': 'Administrateur'
    };
    return labels[this.userRole] || this.userRole;
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.prenom} ${this.currentUser.nom}`;
    }
    return 'Utilisateur';
  }
}
