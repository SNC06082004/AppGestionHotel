import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { AuthService } from '../services/auth.service';

export interface ChambreCard {
  id: number;
  nom: string;
  description: string;
  image: string;
  colorClass: string;
  tags: string[];
  prixOriginal: number;
  prixPromo: number;
  remise: string;
  type: string;
}

export interface Module {
  icon: string;
  label: string;
  route: string;
  roles: string[];
}

export interface Stat {
  label: string;
  value: string;
}

export interface SearchForm {
  dateArrivee: string;
  dateDepart: string;
  adultes: number;
  enfants: number;
  agesEnfants: (number | null)[];
  chambresNb: number;
  avecAnimal: boolean;
}

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css']
})
export class Accueil implements OnInit {

  private router = inject(Router);
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);

  // ── Fourchettes de prix ──
  fourchettes: Record<string, { min: number; max: number }> = {};

  // ── Panel voyageurs ──
  showVoyageursPanel = false;
  agesDisponibles: number[] = Array.from({ length: 18 }, (_, i) => i);

  searchForm: SearchForm = {
    dateArrivee: '',
    dateDepart: '',
    adultes: 2,
    enfants: 0,
    agesEnfants: [],
    chambresNb: 1,
    avecAnimal: false
  };

  get voyageursSummary(): string {
    const a = this.searchForm.adultes;
    const e = this.searchForm.enfants;
    const c = this.searchForm.chambresNb;
    const adulteStr  = `${a} adulte${a > 1 ? 's' : ''}`;
    const enfantStr  = `${e} enfant${e > 1 ? 's' : ''}`;
    const chambreStr = `${c} chambre${c > 1 ? 's' : ''}`;
    return `${adulteStr} · ${enfantStr} · ${chambreStr}`;
  }

  toggleVoyageursPanel(): void {
    this.showVoyageursPanel = !this.showVoyageursPanel;
  }

  increment(field: 'adultes' | 'enfants' | 'chambresNb'): void {
    if (field === 'enfants') {
      this.searchForm.enfants++;
    } else {
      this.searchForm[field]++;
    }
  }

  decrement(field: 'adultes' | 'enfants' | 'chambresNb'): void {
    if (field === 'enfants' && this.searchForm.enfants > 0) {
      this.searchForm.enfants--;
    } else if (field !== 'enfants' && this.searchForm[field] > 1) {
      this.searchForm[field]--;
    }
  }

  onSearch(): void {
    console.log('Recherche :', this.searchForm);
    this.showVoyageursPanel = false;
  }

  // ── Modules de navigation ──
  modules: Module[] = [
    { icon: '⚙️', label: 'Administration', route: '/administration', roles: ['ADMIN'] },
    { icon: '💬', label: 'Plaintes & Demandes', route: '/plainteetdemande', roles: ['CLIENT', 'RECEPTIONNISTE'] },
    { icon: '🎖️', label: 'Cartes fidélité', route: '/fidelite', roles: ['CLIENT'] },
    { icon: '💲', label: 'Gestion des clients', route: '/gestion-clients', roles: ['ADMIN', 'RECEPTIONNISTE'] },
    { icon: '📋', label: 'Affectation', route: '/dashboard', roles: ['PERSONNEL'] },
  ];

  // ── Statistiques ──
  stats: Stat[] = [
    { label: 'Chambres disponibles', value: '24' },
    { label: 'Réservations du jour', value: '8'  },
    { label: 'Check-ins prévus',     value: '5'  },
    { label: "Taux d'occupation",    value: '67 %' },
  ];

  // ── Cards des chambres ──
  chambres: ChambreCard[] = [
    {
      id: 1, type: 'SIMPLE',
      nom: 'Chambre Classic',
      description: 'Lit double ou deux lits simples, salle de bain privée, TV, Wi-Fi',
      image: '/simple.png', colorClass: 'classic',
      tags: ['20 m²', 'Wi-Fi', 'Climatisation'],
      prixOriginal: 80000, prixPromo: 59000, remise: '-26 %',
    },
    {
      id: 2, type: 'DOUBLE',
      nom: 'Junior Suite',
      description: 'Espace séjour séparé et balcon privatif. Parfaite pour un week-end en amoureux.',
      image: '/double.png', colorClass: 'junior',
      tags: ['32 m²', 'Balcon', 'Mini-bar'],
      prixOriginal: 120000, prixPromo: 89000, remise: '-26 %',
    },
    {
      id: 3, type: 'SUITE',
      nom: 'Suite Supérieure',
      description: 'Luxe et sérénité avec jacuzzi privatif et vue imprenable sur la ville.',
      image: '/chambrz2.jpeg', colorClass: 'suite',
      tags: ['45 m²', 'Jacuzzi', 'Vue panoramique'],
      prixOriginal: 200000, prixPromo: 149000, remise: '-25 %',
    },
    {
      id: 4, type: 'PRESIDENTIELLE',
      nom: 'Suite Prestige',
      description: 'Service butler dédié, salon privé et équipements premium pour les hôtes exigeants.',
      image: '/suitePresi.jpg', colorClass: 'prestige',
      tags: ['60 m²', 'Salon privé', 'Butler'],
      prixOriginal: 320000, prixPromo: 229000, remise: '-28 %',
    },
    {
      id: 5, type: 'FAMILIALE',
      nom: 'Suite Familiale',
      description: 'Deux chambres communicantes et kitchenette équipée pour toute la famille.',
      image: '/familiale.jpg', colorClass: 'famille',
      tags: ['55 m²', '2 chambres', 'Kitchenette'],
      prixOriginal: 250000, prixPromo: 185000, remise: '-26 %',
    },
    {
      id: 6, type: 'DELUXE',
      nom: 'Penthouse',
      description: 'Le summum du luxe. Terrasse privée avec piscine et vue 360° sur la ville.',
      image: '/delux.jpg', colorClass: 'penthouse',
      tags: ['120 m²', 'Terrasse', 'Piscine privée'],
      prixOriginal: 650000, prixPromo: 459000, remise: '-29 %',
    },
  ];

  ngOnInit(): void {
    this.loadFourchettes();
  }

  getVisibleModules(): Module[] {
    const role = this.authService.getAppRole(this.authService.getCurrentUser());
    if (!role) return [];
    return this.modules.filter((m) => m.roles.includes(role));
  }

  /** Le personnel ne réserve pas ; client et autres rôles oui. */
  canBookRooms(): boolean {
    const role = this.authService.getAppRole(this.authService.getCurrentUser());
    return role !== 'PERSONNEL';
  }

  loadFourchettes(): void {
    ['SIMPLE', 'DOUBLE', 'SUITE', 'FAMILIALE', 'DELUXE', 'PRESIDENTIELLE'].forEach(type => {
      this.reservationService.getFourchettePrix(type).subscribe({
        next: (f) => this.fourchettes[type] = f,
        error: () => {}
      });
    });
  }

  getFourchette(room: ChambreCard): string {
    const f = this.fourchettes[room.type];
    if (!f || (f.min === 0 && f.max === 0)) {
      return `${room.prixPromo.toLocaleString()} FCFA / nuit`;
    }
    if (f.min === f.max) return `${f.min.toLocaleString()} FCFA / nuit`;
    return `${f.min.toLocaleString()} – ${f.max.toLocaleString()} FCFA / nuit`;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  reserverChambre(room: ChambreCard): void {
    this.router.navigate(['/reservation'], {
      state: { roomType: room.type, roomNom: room.nom }
    });
  }

  voirOffres(): void {
    console.log('Voir toutes les offres promotionnelles');
  }
}