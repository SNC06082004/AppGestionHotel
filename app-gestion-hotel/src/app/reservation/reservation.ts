import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Payement } from "../payement/payement";
import { ReservationService } from '../services/reservation.service';
import { AuthService } from '../services/auth.service';

interface SearchForm {
  dateArrivee: string;
  dateDepart: string;
  adultes: number;
  enfants: number;
  agesEnfants: (number | null)[];
  chambresNb: number;
  avecAnimal: boolean;
}

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, Payement],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css']
})
export class Reservation implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);

  roomType = '';
  roomNom = '';

  // Dispo
  dispoResult: any = null;
  dispoLoading = false;
  chambreChoisie: any = null;

  // Réservation créée
  reservationCreee: any = null;
  showPaymentModal = false;

  readonly prixParNuit = 75_000;
  searchForm: SearchForm = {
    dateArrivee: '', dateDepart: '',
    adultes: 1, enfants: 0,
    agesEnfants: [], chambresNb: 1, avecAnimal: false
  };
  showVoyageursPanel = false;
  nightLabel = 'Sélectionnez vos dates';
  nights = 0;

  ngOnInit(): void {
    // Récupérer le type depuis navigation state
    const state = history.state;
    if (state?.roomType) {
      this.roomType = state.roomType;
      this.roomNom = state.roomNom;
    }
  }

  get totalCost(): number {
    if (this.chambreChoisie) return this.chambreChoisie.price * this.nights;
    return this.prixParNuit * this.nights;
  }

  get voyageursSummary(): string {
    const a = this.searchForm.adultes;
    const e = this.searchForm.enfants;
    const c = this.searchForm.chambresNb;
    let s = `${a} adulte${a > 1 ? 's' : ''}`;
    if (e > 0) s += ` · ${e} enfant${e > 1 ? 's' : ''}`;
    s += ` · ${c} chambre${c > 1 ? 's' : ''}`;
    return s;
  }

  recalc(): void {
    const { dateArrivee, dateDepart } = this.searchForm;
    if (!dateArrivee || !dateDepart) {
      this.nightLabel = 'Sélectionnez vos dates'; this.nights = 0; return;
    }
    const diff = Math.round(
      (new Date(dateDepart).getTime() - new Date(dateArrivee).getTime()) / 86_400_000
    );
    this.nights = diff > 0 ? diff : 0;
    this.nightLabel = diff > 0
      ? `${diff} nuit${diff > 1 ? 's' : ''} · Arrivée–départ`
      : 'Dates invalides';
    // Reset dispo si dates changent
    this.dispoResult = null;
    this.chambreChoisie = null;
  }

  checkDisponibilite(): void {
    if (!this.searchForm.dateArrivee || !this.searchForm.dateDepart || this.nights <= 0) {
      alert('Veuillez sélectionner des dates valides.'); return;
    }
    this.dispoLoading = true;
    this.dispoResult = null;

    const totalPersonnes = this.searchForm.adultes + this.searchForm.enfants;

    this.reservationService.checkDisponibilite(
      this.roomType,
      totalPersonnes,
      this.searchForm.dateArrivee,
      this.searchForm.dateDepart
    ).subscribe({
      next: (result: { disponible: any; chambresDisponibles: string | any[]; }) => {
        this.dispoResult = result;
        if (result.disponible && result.chambresDisponibles?.length > 0) {
          // Sélection aléatoire côté front aussi (ou prendre le premier)
          const idx = Math.floor(Math.random() * result.chambresDisponibles.length);
          this.chambreChoisie = result.chambresDisponibles[idx];
        }
        this.dispoLoading = false;
      },
      error: () => { this.dispoLoading = false; alert('Erreur lors de la vérification.'); }
    });
  }

  onValider(): void {
    if (!this.dispoResult?.disponible || !this.chambreChoisie) {
      alert('Vérifiez d\'abord la disponibilité.'); return;
    }
    this.showPaymentModal = true;
  }

  onPaymentDone(ref: string): void {
    const client = this.authService.getCurrentUser();
    this.reservationService.creerReservation({
      clientId: client.id,
      type: this.roomType,
      capacite: this.searchForm.adultes + this.searchForm.enfants,
      checkIn: this.searchForm.dateArrivee,
      checkOut: this.searchForm.dateDepart,
      adultes: this.searchForm.adultes,
      enfants: this.searchForm.enfants,
      chambresNb: this.searchForm.chambresNb,
      avecAnimal: this.searchForm.avecAnimal,
    }).subscribe({
      next: (res: any) => {
        this.reservationCreee = res;
        this.genererRecu(res, ref);
      },
      error: () => alert('Erreur lors de la création de la réservation.')
    });
  }

  genererRecu(res: any, refPaiement: string): void {
    // Génération PDF avec jsPDF
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();

    // En-tête
    doc.setFillColor(26, 15, 46);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LUXORA HOTEL', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text('Reçu de réservation', 105, 28, { align: 'center' });

    // Références
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Référence réservation : ${res.reference}`, 20, 55);
    doc.text(`Référence paiement    : ${refPaiement}`, 20, 63);

    // Ligne séparatrice
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.5);
    doc.line(20, 70, 190, 70);

    // Infos client
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Informations client', 20, 82);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nom    : ${res.nomClient}`, 20, 92);
    doc.text(`Email  : ${res.emailClient}`, 20, 100);

    // Infos chambre
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Détails du séjour', 20, 115);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Type de chambre : ${res.typeChambre}`, 20, 125);
    doc.text(`Chambre N°      : ${res.numeroChambre} (Étage ${res.etage})`, 20, 133);
    doc.text(`Check-in        : ${res.checkIn}`, 20, 141);
    doc.text(`Check-out       : ${res.checkOut}`, 20, 149);
    doc.text(`Durée           : ${res.nuits} nuit(s)`, 20, 157);
    doc.text(`Adultes         : ${res.adultes}`, 20, 165);
    doc.text(`Enfants         : ${res.enfants}`, 20, 173);

    // Total
    doc.line(20, 182, 190, 182);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(26, 15, 46);
    doc.text(`TOTAL PAYÉ : ${res.prixTotal.toLocaleString()} FCFA`, 20, 195);

    // Pied
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Merci de votre confiance. Nous vous souhaitons un agréable séjour.', 105, 270, { align: 'center' });
    doc.text('Luxora Hotel · Service Prestige · 2026', 105, 278, { align: 'center' });

    doc.save(`recu-${res.reference}.pdf`);
  }

  increment(field: 'adultes' | 'enfants' | 'chambresNb'): void {
    const max = field === 'enfants' ? 10 : 30;
    if (this.searchForm[field] < max) this.searchForm[field]++;
    this.dispoResult = null; this.chambreChoisie = null;
  }

  decrement(field: 'adultes' | 'enfants' | 'chambresNb'): void {
    const min = field === 'adultes' || field === 'chambresNb' ? 1 : 0;
    if (this.searchForm[field] > min) this.searchForm[field]--;
    this.dispoResult = null; this.chambreChoisie = null;
  }

  toggleVoyageursPanel(): void { this.showVoyageursPanel = !this.showVoyageursPanel; }
}