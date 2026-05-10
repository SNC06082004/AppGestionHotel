// src/app/components/gestionclient/gestionclient.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError }   from 'rxjs/operators';
import { ClientDTO } from '../models/Client.model';
import { ComplaintDTO } from '../models/complaint.model';
import { DepartDuJourDTO } from '../models/Depart.model';
import { CarteFideliteDTO } from '../models/Fidelite.model';
import { ClientService } from '../services/client.service';
import { DepartService } from '../services/depart.service';
import { FideliteService } from '../services/fidelite.service';
import { PlaintesService } from '../services/plaintes.service';


export type TabId = 'clients' | 'plaintes' | 'speciales' | 'fidelite' | 'departs';

@Component({
  selector: 'app-gestionclient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionclient.html',
  styleUrl: './gestionclient.css',
})
export class Gestionclient implements OnInit {

  // ── État global ───────────────────────────────────────────────
  activeTab: TabId = 'clients';
  searchQuery      = '';
  loading          = false;
  errorMsg         = '';
  today            = new Date();   // utilisé dans le template onglet Départs

  // ── Données ──────────────────────────────────────────────────
  clients:  ClientDTO[]        = [];
  plaintes: ComplaintDTO[]     = [];
  demandes: ComplaintDTO[]     = [];
  cartes:   CarteFideliteDTO[] = [];
  departs:  DepartDuJourDTO[]  = [];

  // ── État d'expansion des lignes clients ──────────────────────
  clientsOuverts = new Set<number>();

  // ── Formulaire nouvelle plainte ──────────────────────────────
  nouvellePlainte: Partial<ComplaintDTO> = {
    clientId:  0,
    type:      'complaint',
    priority:  'Normale',
    subject:   '',
    details:   '',
    status:    'En attente',
  };

  // ── Formulaire nouvelle demande spéciale ─────────────────────
  nouvelleDemande: Partial<ComplaintDTO> = {
    clientId:       0,
    type:           'special-request',
    preferenceType: 'Préférence alimentaire',
    details:        '',
    requestedDate:  '',
    status:         'En attente',
  };

  // ── Formulaire ajout de points ───────────────────────────────
  ajoutPoints = { clientId: 0, points: 0 };

  // ── Feedback inline ──────────────────────────────────────────
  feedbackMsg  = '';
  feedbackType: 'success' | 'error' = 'success';

  // ── Injection ────────────────────────────────────────────────
  constructor(
    private clientService:  ClientService,
    private plaintesService: PlaintesService,
    private fideliteService: FideliteService,
    private departService:   DepartService,
  ) {}

  // ── Initialisation ───────────────────────────────────────────
  ngOnInit(): void {
    this.chargerTout();
  }

  chargerTout(): void {
    this.loading = true;

    forkJoin({
      clients:  this.clientService.getAllClients().pipe(
                  catchError(err => { console.warn('clients:', err.status); return of([]); })
                ),
      plaintes: this.plaintesService.getPlaintes().pipe(
                  catchError(err => { console.warn('plaintes:', err.status); return of([]); })
                ),
      cartes:   this.fideliteService.getAllCartes().pipe(
                  catchError(err => { console.warn('fidelite:', err.status); return of([]); })
                ),
      departs:  this.departService.getDepartsDuJour().pipe(
                  catchError(err => { console.warn('departs:', err.status); return of([]); })
                ),
    }).subscribe(({ clients, plaintes, cartes, departs }) => {
      this.clients = clients as ClientDTO[];
      const all = plaintes as unknown as ComplaintDTO[];
      this.plaintes = all.filter(p => p.type === 'complaint');
      this.demandes = all.filter(p => p.type === 'special-request');
      this.cartes  = cartes  as CarteFideliteDTO[];
      this.departs = departs as DepartDuJourDTO[];
      this.loading = false;
    });
  }

  // ── Navigation ───────────────────────────────────────────────
  switchTab(tab: TabId): void {
    this.activeTab = tab;
    this.feedbackMsg = '';
  }

  // ── Stats ────────────────────────────────────────────────────
  get totalClients():      number { return this.clients.length; }
  get plaintesOuvertes(): number {
    return this.plaintes.filter(p => p.status === 'En attente' || p.status === 'En cours').length;
  }
  get demandesAttente():  number {
    return this.demandes.filter(d => d.status === 'En attente').length;
  }
  get totalFidelite():    number { return this.cartes.length; }
  get departsDuJour():    number { return this.departs.filter(d => !d.departEffectue).length; }

  // ── Clients ──────────────────────────────────────────────────
  get clientsFiltres(): ClientDTO[] {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.clients;
    return this.clients.filter(c =>
      (`${c.prenom} ${c.nom}`).toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }

  toggleClient(client: ClientDTO): void {
    if (this.clientsOuverts.has(client.id)) {
      this.clientsOuverts.delete(client.id);
    } else {
      this.clientsOuverts.clear();
      this.clientsOuverts.add(client.id);
    }
  }

  isClientOuvert(client: ClientDTO): boolean {
    return this.clientsOuverts.has(client.id);
  }

  initialesClient(client: ClientDTO): string {
    return (
      (client.prenom?.charAt(0) ?? '') +
      (client.nom?.charAt(0)    ?? '')
    ).toUpperCase();
  }

  nomComplet(client: ClientDTO): string {
    return `${client.prenom} ${client.nom}`;
  }

  getBadgesClient(client: ClientDTO): string[] {
    const badges: string[] = [];
    const carte = this.cartes.find(c => c.clientId === client.id);
    if (carte) badges.push(carte.tier);
    if (this.plaintes.some(p =>
      p.clientId === client.id &&
      (p.status === 'En attente' || p.status === 'En cours')
    )) badges.push('Plainte');
    if (this.demandes.some(d =>
      d.clientId === client.id && d.status !== 'Résolue'
    )) badges.push('Demande');
    return badges;
  }

  badgeClass(badge: string): string {
    if (['GOLD','SILVER','BRONZE','PLATINUM'].includes(badge)) return 'badge-fid';
    if (badge === 'Plainte')  return 'badge-plainte';
    if (badge === 'Demande')  return 'badge-special';
    return 'badge-ok';
  }

  getPointsClient(clientId: number): number {
    return this.cartes.find(c => c.clientId === clientId)?.points ?? 0;
  }

  // ── Plaintes ─────────────────────────────────────────────────
  ajouterPlainte(): void {
    const { clientId, subject, details, priority } = this.nouvellePlainte;
    if (!clientId || !subject || !details) {
      this.showFeedback('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const payload: ComplaintDTO = {
      clientId:  clientId!,
      type:      'complaint',
      priority:  priority ?? 'Normale',
      subject:   subject,
      details:   details!,
      status:    'En attente',
    };

    this.plaintesService.createPlainte(payload).subscribe({
      next: created => {
        this.plaintes.unshift(created as unknown as ComplaintDTO);
        this.resetFormPlainte();
        this.showFeedback('Plainte enregistrée avec succès.', 'success');
      },
      error: () => this.showFeedback('Erreur lors de l\'enregistrement.', 'error'),
    });
  }

  changerStatutPlainte(plainte: ComplaintDTO, statut: string): void {
    if (!plainte.id) return;
    this.plaintesService.updatePlainte(plainte.id, { ...plainte, status: statut })
      .subscribe({
        next: updated => {
          const idx = this.plaintes.findIndex(p => p.id === updated.id);
          if (idx !== -1) this.plaintes[idx] = updated as unknown as ComplaintDTO;
        },
        error: () => this.showFeedback('Erreur lors de la mise à jour.', 'error'),
      });
  }

  // ── Demandes spéciales ───────────────────────────────────────
  ajouterDemande(): void {
    const { clientId, preferenceType, details, requestedDate } = this.nouvelleDemande;
    if (!clientId || !details) {
      this.showFeedback('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const payload: ComplaintDTO = {
      clientId:       clientId!,
      type:           'special-request',
      preferenceType: preferenceType ?? 'Autre',
      details:        details!,
      requestedDate:  requestedDate,
      status:         'En attente',
    };

    this.plaintesService.createPlainte(payload).subscribe({
      next: created => {
        this.demandes.unshift(created as unknown as ComplaintDTO);
        this.resetFormDemande();
        this.showFeedback('Demande enregistrée avec succès.', 'success');
      },
      error: () => this.showFeedback('Erreur lors de l\'enregistrement.', 'error'),
    });
  }

  changerStatutDemande(demande: ComplaintDTO, statut: string): void {
    if (!demande.id) return;
    this.plaintesService.updatePlainte(demande.id, { ...demande, status: statut })
      .subscribe({
        next: updated => {
          const idx = this.demandes.findIndex(d => d.id === updated.id);
          if (idx !== -1) this.demandes[idx] = updated as unknown as ComplaintDTO;
        },
        error: () => this.showFeedback('Erreur lors de la mise à jour.', 'error'),
      });
  }

  // ── Fidélité ─────────────────────────────────────────────────
  progression(carte: CarteFideliteDTO): number {
    if (carte.tier === 'PLATINUM') return 100;
    return Math.min(100, Math.round((carte.points / carte.palierSuivant) * 100));
  }

  tierClass(tier: string): string {
    const map: Record<string, string> = {
      BRONZE: 'tier-bronze', SILVER: 'tier-silver',
      GOLD: 'tier-gold',     PLATINUM: 'tier-platinum',
    };
    return map[tier] ?? '';
  }

  attribuerPoints(): void {
    const { clientId, points } = this.ajoutPoints;
    if (!clientId || points <= 0) {
      this.showFeedback('Sélectionner un client et entrer un nombre de points valide.', 'error');
      return;
    }

    this.fideliteService.ajouterPoints(clientId, points).subscribe({
      next: updated => {
        const idx = this.cartes.findIndex(c => c.clientId === updated.clientId);
        if (idx !== -1) this.cartes[idx] = updated;
        else this.cartes.push(updated);
        this.ajoutPoints = { clientId: 0, points: 0 };
        this.showFeedback(`${points} points ajoutés avec succès.`, 'success');
      },
      error: () => this.showFeedback('Erreur lors de l\'attribution des points.', 'error'),
    });
  }

  // ── Départs du jour ──────────────────────────────────────────
  marquerDepart(depart: DepartDuJourDTO): void {
    this.departService.marquerDepartEffectue(depart.reservationId).subscribe({
      next: updated => {
        const idx = this.departs.findIndex(d => d.reservationId === updated.reservationId);
        if (idx !== -1) this.departs[idx] = updated;
        // Rafraîchir les cartes fidélité (points mis à jour côté serveur)
        this.fideliteService.getAllCartes().subscribe(cartes => this.cartes = cartes);
        this.showFeedback(
          `Départ de ${updated.clientNom} enregistré. Chambre ${updated.numeroChambre} en nettoyage.`,
          'success'
        );
      },
      error: () => this.showFeedback('Erreur lors de l\'enregistrement du départ.', 'error'),
    });
  }

  statutChambreLabel(statut: string): string {
    const map: Record<string, string> = {
      DISPONIBLE:     'Disponible',
      OCCUPEE:        'Occupée',
      EN_NETTOYAGE:   'En nettoyage',
      EN_MAINTENANCE: 'En maintenance',
      RESERVEE:       'Réservée',
    };
    return map[statut] ?? statut;
  }

  // ── Helpers label / class partagés ───────────────────────────
  statutLabel(s: string): string {
    const map: Record<string, string> = {
      'En attente': 'En attente',
      'En cours':   'En cours',
      'Résolue':    'Résolue',
    };
    return map[s] ?? s;
  }

  statutClass(s: string): string {
    if (s === 'En attente') return 'st-open';
    if (s === 'En cours')   return 'st-progress';
    return 'st-done';
  }

  dotClass(s: string): string {
    if (s === 'En attente') return 'dot-red';
    if (s === 'En cours')   return 'dot-amber';
    return 'dot-green';
  }

  // ── Utilitaires ──────────────────────────────────────────────
  nomsClients(): ClientDTO[] {
    return this.clients;
  }

  private resetFormPlainte(): void {
    this.nouvellePlainte = {
      clientId: 0, type: 'complaint',
      priority: 'Normale', subject: '', details: '', status: 'En attente',
    };
  }

  private resetFormDemande(): void {
    this.nouvelleDemande = {
      clientId: 0, type: 'special-request',
      preferenceType: 'Préférence alimentaire',
      details: '', requestedDate: '', status: 'En attente',
    };
  }

  private showFeedback(msg: string, type: 'success' | 'error'): void {
    this.feedbackMsg  = msg;
    this.feedbackType = type;
    setTimeout(() => this.feedbackMsg = '', 4000);
  }
}