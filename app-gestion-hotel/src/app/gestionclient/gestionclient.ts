import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type TabId = 'clients' | 'plaintes' | 'speciales' | 'fidelite';
export type Statut = 'ouverte' | 'en_cours' | 'resolue' | 'en_attente' | 'traite';
export type Tier = 'Bronze' | 'Silver' | 'Gold';

export interface Client {
  id: string;
  initiales: string;
  nom: string;
  chambre: string;
  arrivee: string;
  depart: string;
  telephone: string;
  email: string;
  sejours: number;
  ouvert: boolean;
}

export interface Plainte {
  id: string;
  clientNom: string;
  chambre: string;
  objet: string;
  priorite: 'urgente' | 'normale' | 'basse';
  date: string;
  statut: Statut;
}

export interface DemandeSpeciale {
  id: string;
  clientNom: string;
  chambre: string;
  type: string;
  detail: string;
  dateSouhaitee: string;
  statut: Statut;
}

export interface CarteFidelite {
  clientId: string;
  initiales: string;
  nom: string;
  numero: string;
  tier: Tier;
  points: number;
  palierSuivant: number;
  sejours: number;
  membreDepuis: string;
}

@Component({
  selector: 'app-gestionclient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionclient.html',
  styleUrl: './gestionclient.css',
})
export class Gestionclient {

  activeTab: TabId = 'clients';
  searchQuery = '';

  // ── Données clients ──
  clients: Client[] = [
    { id: 'c1', initiales: 'KO', nom: 'Koné Oumar',     chambre: '204', arrivee: '2026-04-15', depart: '2026-04-18', telephone: '+226 07 11 22 33', email: 'k.oumar@mail.com',  sejours: 7, ouvert: false },
    { id: 'c2', initiales: 'ST', nom: 'Sawadogo Tina',  chambre: '310', arrivee: '2026-04-16', depart: '2026-04-20', telephone: '+226 70 44 55 66', email: 'tina.s@mail.com',   sejours: 3, ouvert: false },
    { id: 'c3', initiales: 'BD', nom: 'Bamba Drissa',   chambre: '105', arrivee: '2026-04-17', depart: '2026-04-19', telephone: '+226 76 88 99 00', email: 'bamba.d@mail.com',  sejours: 1, ouvert: false },
  ];

  // ── Plaintes ──
  plaintes: Plainte[] = [
    { id: 'p1', clientNom: 'Sawadogo Tina', chambre: '310', objet: 'Climatisation défectueuse', priorite: 'urgente', date: '2026-04-16', statut: 'ouverte'  },
    { id: 'p2', clientNom: 'Koné Oumar',    chambre: '204', objet: 'Bruit dans le couloir',     priorite: 'normale', date: '2026-04-15', statut: 'en_cours' },
    { id: 'p3', clientNom: 'Traoré Ali',    chambre: '118', objet: 'Serviettes insuffisantes',  priorite: 'basse',   date: '2026-04-14', statut: 'resolue'  },
  ];

  nouvellePlainte = { clientNom: '', priorite: 'normale', objet: '', description: '' };

  // ── Demandes spéciales ──
  demandes: DemandeSpeciale[] = [
    { id: 'd1', clientNom: 'Koné Oumar',   chambre: '204', type: 'Préférence alimentaire', detail: 'Repas végétarien au dîner', dateSouhaitee: '2026-04-15', statut: 'traite'    },
    { id: 'd2', clientNom: 'Yara Fatou',   chambre: '212', type: 'Accessibilité',           detail: 'Lit bébé en chambre',      dateSouhaitee: '2026-04-17', statut: 'en_cours'  },
    { id: 'd3', clientNom: 'Bamba Drissa', chambre: '105', type: 'Transport',               detail: 'Transfert aéroport',       dateSouhaitee: '2026-04-19', statut: 'en_attente'},
  ];

  nouvelleDemande = { clientNom: '', type: 'Préférence alimentaire', detail: '', dateSouhaitee: '', statut: 'en_attente' };

  // ── Fidélité ──
  cartes: CarteFidelite[] = [
    { clientId: 'c1', initiales: 'KO', nom: 'Koné Oumar',    numero: 'LXR-0042', tier: 'Gold',   points: 1250, palierSuivant: 1500, sejours: 7, membreDepuis: 'janv. 2023' },
    { clientId: 'c2', initiales: 'ST', nom: 'Sawadogo Tina', numero: 'LXR-0089', tier: 'Silver', points: 480,  palierSuivant: 750,  sejours: 3, membreDepuis: 'oct. 2024'  },
    { clientId: 'c3', initiales: 'BD', nom: 'Bamba Drissa',  numero: 'LXR-0112', tier: 'Bronze', points: 75,   palierSuivant: 250,  sejours: 1, membreDepuis: 'avr. 2026'  },
  ];

  ajoutPoints = { clientNom: '', points: 0, motif: 'Séjour complété', date: '' };

  // ── Stats ──
  get totalClients()   { return 48; }
  get plaintesOuvertes(){ return this.plaintes.filter(p => p.statut === 'ouverte').length; }
  get demandesAttente(){ return this.demandes.filter(d => d.statut === 'en_attente').length; }
  get totalFidelite()  { return this.cartes.length; }

  // ── Navigation ──
  switchTab(tab: TabId): void { this.activeTab = tab; }

  // ── Clients ──
  get clientsFiltres(): Client[] {
    const q = this.searchQuery.toLowerCase();
    return q ? this.clients.filter(c => c.nom.toLowerCase().includes(q)) : this.clients;
  }

  toggleClient(client: Client): void {
    this.clients.forEach(c => { if (c !== client) c.ouvert = false; });
    client.ouvert = !client.ouvert;
  }

  getBadgesClient(client: Client): string[] {
    const badges: string[] = [];
    const carte = this.cartes.find(c => c.clientId === client.id);
    if (carte) badges.push(carte.tier);
    if (this.plaintes.some(p => p.clientNom === client.nom && p.statut === 'ouverte')) badges.push('Plainte');
    if (this.demandes.some(d => d.clientNom === client.nom && d.statut !== 'traite')) badges.push('Demande');
    return badges;
  }

  badgeClass(badge: string): string {
    if (badge === 'Gold' || badge === 'Silver' || badge === 'Bronze') return 'badge-fid';
    if (badge === 'Plainte') return 'badge-plainte';
    if (badge === 'Demande') return 'badge-special';
    return 'badge-ok';
  }

  getPointsClient(clientId: string): number {
    return this.cartes.find(c => c.clientId === clientId)?.points ?? 0;
  }

  // ── Plaintes ──
  statutLabel(s: Statut): string {
    const map: Record<Statut, string> = { ouverte: 'Ouverte', en_cours: 'En cours', resolue: 'Résolue', en_attente: 'En attente', traite: 'Traité' };
    return map[s];
  }

  statutClass(s: Statut): string {
    if (s === 'ouverte' || s === 'en_attente') return 'st-open';
    if (s === 'en_cours') return 'st-progress';
    return 'st-done';
  }

  dotClass(s: Statut): string {
    if (s === 'ouverte') return 'dot-red';
    if (s === 'en_cours' || s === 'en_attente') return 'dot-amber';
    if (s === 'traite' || s === 'resolue') return 'dot-green';
    return 'dot-purple';
  }

  ajouterPlainte(): void {
    if (!this.nouvellePlainte.clientNom || !this.nouvellePlainte.objet) return;
    const client = this.clients.find(c => c.nom === this.nouvellePlainte.clientNom);
    this.plaintes.unshift({
      id: 'p' + Date.now(),
      clientNom: this.nouvellePlainte.clientNom,
      chambre: client?.chambre ?? '—',
      objet: this.nouvellePlainte.objet,
      priorite: this.nouvellePlainte.priorite as any,
      date: new Date().toISOString().split('T')[0],
      statut: 'ouverte'
    });
    this.nouvellePlainte = { clientNom: '', priorite: 'normale', objet: '', description: '' };
  }

  // ── Demandes spéciales ──
  ajouterDemande(): void {
    if (!this.nouvelleDemande.clientNom || !this.nouvelleDemande.detail) return;
    const client = this.clients.find(c => c.nom === this.nouvelleDemande.clientNom);
    this.demandes.unshift({
      id: 'd' + Date.now(),
      clientNom: this.nouvelleDemande.clientNom,
      chambre: client?.chambre ?? '—',
      type: this.nouvelleDemande.type,
      detail: this.nouvelleDemande.detail,
      dateSouhaitee: this.nouvelleDemande.dateSouhaitee,
      statut: 'en_attente'
    });
    this.nouvelleDemande = { clientNom: '', type: 'Préférence alimentaire', detail: '', dateSouhaitee: '', statut: 'en_attente' };
  }

  // ── Fidélité ──
  progression(carte: CarteFidelite): number {
    return Math.round((carte.points / carte.palierSuivant) * 100);
  }

  tierClass(tier: Tier): string {
    const map: Record<Tier, string> = { Bronze: 'tier-bronze', Silver: 'tier-silver', Gold: 'tier-gold' };
    return map[tier];
  }

  attribuerPoints(): void {
    if (!this.ajoutPoints.clientNom || !this.ajoutPoints.points) return;
    const nom = this.ajoutPoints.clientNom.split(' — ')[0];
    const carte = this.cartes.find(c => c.nom === nom);
    if (carte) carte.points += Number(this.ajoutPoints.points);
    this.ajoutPoints = { clientNom: '', points: 0, motif: 'Séjour complété', date: '' };
  }

  nomsClients(): string[] { return this.clients.map(c => c.nom); }
}