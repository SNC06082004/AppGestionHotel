import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-administration',
  imports: [CommonModule, RouterModule],
  templateUrl: './administration.html',
  styleUrl: './administration.css',
})
export class Administration implements OnInit {
hotelName = 'Hôtel Paradise';
  username = 'Alexandre Martin';
  role = 'Directeur Général';
  currentDate = '';

  stats = [
    { 
      label: 'Chambres occupées', 
      value: '87', 
      total: '120', 
      percent: '72.5%',
      color: 'from-blue-500 to-indigo-600', 
      icon: '🛏️' 
    },
    { 
      label: 'Taux d\'occupation', 
      value: '72.5', 
      unit: '%', 
      color: 'from-emerald-500 to-teal-600', 
      icon: '📊' 
    },
    { 
      label: 'Arrivées aujourd\'hui', 
      value: '14', 
      color: 'from-amber-500 to-orange-600', 
      icon: '✈️' 
    },
    { 
      label: 'Chiffre d\'affaires du mois', 
      value: '48 250', 
      unit: '€', 
      color: 'from-purple-500 to-violet-600', 
      icon: '💎' 
    }
  ];

  menuItems = [
    { name: 'Tableau de bord', icon: '🏠', route: '/dashboard', active: true },
    { name: 'Utilisateurs', icon: '👥', route: '/adminUser' },
    { name: 'Gestion des Chambres', icon: '🛏️', route: '/addchambre' },
    //{ name: 'Réservations', icon: '📅', route: '/reservations' },
    //{ name: 'Gestion des Clients', icon: '👤', route: '/adminUser' },
    { name: 'Facturation & Paiements', icon: '💳', route: '/billing' },
    { name: 'Catalogue', icon: '📚', route: '/catalog' }
  ];

  ngOnInit() {
    this.currentDate = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }
  }
