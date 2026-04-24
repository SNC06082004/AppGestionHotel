import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Payement } from "../payement/payement";

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

  readonly prixParNuit = 75_000;

  searchForm: SearchForm = {
    dateArrivee: '',
    dateDepart: '',
    adultes: 1,
    enfants: 0,
    agesEnfants: [],
    chambresNb: 1,
    avecAnimal: false
  };

  showVoyageursPanel = false;
  nightLabel = 'Sélectionnez vos dates';
  nights = 0;
  agesDisponibles: number[] = Array.from({ length: 18 }, (_, i) => i);

  ngOnInit(): void {}

  get voyageursSummary(): string {
    const a = this.searchForm.adultes;
    const e = this.searchForm.enfants;
    const c = this.searchForm.chambresNb;
    let s = `${a} adulte${a > 1 ? 's' : ''}`;
    if (e > 0) s += ` · ${e} enfant${e > 1 ? 's' : ''}`;
    s += ` · ${c} chambre${c > 1 ? 's' : ''}`;
    return s;
  }

  get totalCost(): number {
    return this.prixParNuit * this.nights * this.searchForm.chambresNb;
  }

  recalc(): void {
    const { dateArrivee, dateDepart } = this.searchForm;
    if (!dateArrivee || !dateDepart) {
      this.nightLabel = 'Sélectionnez vos dates';
      this.nights = 0;
      return;
    }
    const diff = Math.round(
      (new Date(dateDepart).getTime() - new Date(dateArrivee).getTime()) / 86_400_000
    );
    if (diff <= 0) {
      this.nightLabel = 'Dates invalides';
      this.nights = 0;
    } else {
      this.nights = diff;
      this.nightLabel = `${diff} nuit${diff > 1 ? 's' : ''} · Arrivée–départ`;
    }
  }

  toggleVoyageursPanel(): void {
    this.showVoyageursPanel = !this.showVoyageursPanel;
  }

  increment(field: 'adultes' | 'enfants' | 'chambresNb'): void {
    const max = field === 'enfants' ? 10 : 30;
    if (this.searchForm[field] < max) {
      this.searchForm[field]++;
      if (field === 'enfants') this.syncAgesEnfants();
    }
  }

  decrement(field: 'adultes' | 'enfants' | 'chambresNb'): void {
    const min = field === 'adultes' || field === 'chambresNb' ? 1 : 0;
    if (this.searchForm[field] > min) {
      this.searchForm[field]--;
      if (field === 'enfants') this.syncAgesEnfants();
    }
  }

  private syncAgesEnfants(): void {
    const nb = this.searchForm.enfants;
    const curr = this.searchForm.agesEnfants;
    if (curr.length < nb) {
      while (this.searchForm.agesEnfants.length < nb) {
        this.searchForm.agesEnfants.push(null);
      }
    } else {
      this.searchForm.agesEnfants = curr.slice(0, nb);
    }
  }

 showPaymentModal = false;

onValider(): void {
  if (!this.searchForm.dateArrivee || !this.searchForm.dateDepart || this.nights <= 0) {
    alert('Veuillez compléter vos dates de séjour.');
    return;
  }
  this.showPaymentModal = true;
}

onPaymentDone(ref: string): void {
  console.log('Réservation payée, réf :', ref);
}
}