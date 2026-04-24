// accueil.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Chambre {
  id: number;
  nom: string;
  description: string;
  emoji: string;
  colorClass: string;
  tags: string[];
  prixOriginal: number;
  prixPromo: number;
  remise: string;
}

export interface Module {
  icon: string;
  label: string;
  route: string;
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
export class Accueil {

  constructor(private router: Router) {}

  /* ── Panel voyageurs ── */
  showVoyageursPanel = false;

  /* ── Liste des âges disponibles (0 à 17 ans) ── */
  agesDisponibles: number[] = Array.from({ length: 18 }, (_, i) => i);

  /* ── Formulaire de recherche ── */
  searchForm: SearchForm = {
    dateArrivee: '',
    dateDepart: '',
    adultes: 2,
    enfants: 0,
    agesEnfants: [],
    chambresNb: 1,
    avecAnimal: false
  };

  /* ── Résumé affiché dans le déclencheur ── */
  get voyageursSummary(): string {
    const a = this.searchForm.adultes;
    const e = this.searchForm.enfants;
    const c = this.searchForm.chambresNb;
    const adulteStr   = `${a} adulte${a > 1 ? 's' : ''}`;
    const enfantStr   = `${e} enfant${e > 1 ? 's' : ''}`;
    const chambreStr  = `${c} chambre${c > 1 ? 's' : ''}`;
    return `${adulteStr} · ${enfantStr} · ${chambreStr}`;
  }

  /* ── Ouvrir / fermer le panel ── */
  toggleVoyageursPanel(): void {
    this.showVoyageursPanel = !this.showVoyageursPanel;
  }

  /* ── Incrémenter un compteur ── */
  increment(field: 'adultes' | 'enfants' | 'chambresNb'): void {
    if (field === 'enfants') {
      this.searchForm.enfants++;
      this.searchForm.agesEnfants.push(null);
    } else {
      this.searchForm[field]++;
    }
  }

  /* ── Décrémenter un compteur ── */
  decrement(field: 'adultes' | 'enfants' | 'chambresNb'): void {
    if (field === 'enfants' && this.searchForm.enfants > 0) {
      this.searchForm.enfants--;
      this.searchForm.agesEnfants.pop();
    } else if (field !== 'enfants' && this.searchForm[field] > 1) {
      this.searchForm[field]--;
    }
  }

  /* ── Modules de navigation ── */
  modules: Module[] = [
    { icon: '⚙️', label: 'Administration',     route: '/admin' },
    { icon: '📅', label: 'Réservations',        route: '/reservations' },
    { icon: '💬', label: 'Plaintes & Demandes', route: '/plaintes' },
    { icon: '🎖️', label: 'Cartes fidélité',     route: '/fidelite' },
    { icon: '💲', label: 'Gestion des tarifs',  route: '/tarifs' },
  ];

  /* ── Statistiques ── */
  stats: Stat[] = [
    { label: 'Chambres disponibles', value: '24' },
    { label: 'Réservations du jour', value: '8' },
    { label: 'Check-ins prévus',     value: '5' },
    { label: "Taux d'occupation",    value: '67 %' },
  ];

  /* ── Catalogue des chambres ── */
  chambres: Chambre[] = [
    {
      id: 1,
      nom: 'Chambre Classic',
      description: "Lit double ou deux lits simples, salle de bain privée, TV, Wi-Fi",
      emoji: '🛏️',
      colorClass: 'classic',
      tags: ['20 m²', 'Wi-Fi', 'Climatisation'],
      prixOriginal: 80000,
      prixPromo: 59000,
      remise: '-26 %',
    },
    {
      id: 2,
      nom: 'Junior Suite',
      description: 'Espace séjour séparé et balcon privatif. Parfaite pour un week-end en amoureux.',
      emoji: '🛋️',
      colorClass: 'junior',
      tags: ['32 m²', 'Balcon', 'Mini-bar'],
      prixOriginal: 120000,
      prixPromo: 89000,
      remise: '-26 %',
    },
    {
      id: 3,
      nom: 'Suite Supérieure',
      description: 'Luxe et sérénité avec jacuzzi privatif et vue imprenable sur la ville.',
      emoji: '🛁',
      colorClass: 'suite',
      tags: ['45 m²', 'Jacuzzi', 'Vue panoramique'],
      prixOriginal: 200000,
      prixPromo: 149000,
      remise: '-25 %',
    },
    {
      id: 4,
      nom: 'Suite Prestige',
      description: 'Service butler dédié, salon privé et équipements premium pour les hôtes exigeants.',
      emoji: '🏆',
      colorClass: 'prestige',
      tags: ['60 m²', 'Salon privé', 'Butler'],
      prixOriginal: 320000,
      prixPromo: 229000,
      remise: '-28 %',
    },
    {
      id: 5,
      nom: 'Suite Familiale',
      description: 'Deux chambres communicantes et kitchenette équipée pour toute la famille.',
      emoji: '👨‍👩‍👧',
      colorClass: 'famille',
      tags: ['55 m²', '2 chambres', 'Kitchenette'],
      prixOriginal: 250000,
      prixPromo: 185000,
      remise: '-26 %',
    },
    {
      id: 6,
      nom: 'Penthouse',
      description: 'Le summum du luxe. Terrasse privée avec piscine et vue 360° sur la ville.',
      emoji: '🌇',
      colorClass: 'penthouse',
      tags: ['120 m²', 'Terrasse', 'Piscine privée'],
      prixOriginal: 650000,
      prixPromo: 459000,
      remise: '-29 %',
    },
  ];

  /* ── Actions ── */
  onSearch(): void {
    // Vérifier que tous les âges des enfants sont renseignés
    const agesIncomplets = this.searchForm.agesEnfants.some(age => age === null);
    if (agesIncomplets) {
      alert('Veuillez renseigner l\'âge de chaque enfant.');
      return;
    }
    console.log('Recherche :', this.searchForm);
    this.showVoyageursPanel = false;
    // TODO : appeler le service de disponibilités
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  reserverChambre(chambre: Chambre): void {
    this.router.navigate(['/reservations'], { queryParams: { chambreId: chambre.id } });
  }

  voirOffres(): void {
    console.log('Voir toutes les offres promotionnelles');
    // TODO : naviguer vers la page des offres
  }
}