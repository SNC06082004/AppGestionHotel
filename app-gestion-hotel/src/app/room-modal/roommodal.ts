import { Component, EventEmitter, inject, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChambreService } from '../services/chambre.service';
import { PersonnelService } from '../services/personnel.service';
import { Room, Guest, ActionEvent } from '../models/chambre.model';

type ModalAction = null | 'cleaning' | 'maintenance' | 'guest';

@Component({
  selector: 'app-roommodal',
  imports: [CommonModule, FormsModule],
  templateUrl: './roommodal.html',
  styleUrl: './roommodal.css',
})
export class Roommodal implements OnInit {
  @Input({ required: true }) room!: Room;
  @Output() close = new EventEmitter<void>();
  @Output() actionDone = new EventEmitter<ActionEvent>();

  private roomService = inject(ChambreService);
  private personnelService = inject(PersonnelService);

  action = signal<ModalAction>(null);
  isLoading = signal(false);

  // ────── PERSONNEL LISTS (signals) ──────
  cleaningStaff = signal<any[]>([]);
  maintenanceStaff = signal<any[]>([]);

  // ────── SÉLECTIONS (ngModel) ──────
  selectedCleaningStaff = '';
  selectedMaintenanceStaff = '';
  maintenanceNotes = '';

  // ────── CLIENT ──────
  guestName = '';
  guestEmail = '';
  guestPhone = '';
  guestCheckIn = new Date().toISOString().split('T')[0];
  guestCheckOut = '';

  ngOnInit(): void {
    this.loadPersonnel();
  }

  loadPersonnel(): void {
    // ✅ Charger les femmes de chambre
    this.personnelService.getCleaningStaff().subscribe({
      next: (staff) => {
        console.log('🧹 Personnel nettoyage:', staff);
        this.cleaningStaff.set(staff);
      },
      error: (err) => console.error('❌ Erreur nettoyage:', err)
    });

    // ✅ Charger les techniciens
    this.personnelService.getMaintenanceStaff().subscribe({
      next: (staff) => {
        console.log('🔧 Personnel maintenance:', staff);
        this.maintenanceStaff.set(staff);
      },
      error: (err) => console.error('❌ Erreur maintenance:', err)
    });
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      DISPONIBLE: 'Disponible',
      OCCUPEE: 'Occupée',
      EN_NETTOYAGE: 'En nettoyage',
      EN_MAINTENANCE: 'En maintenance',
    };
    return map[this.room.status] ?? this.room.status;
  }

  get actionTitle(): string {
    const map: Record<string, string> = {
      cleaning: 'Affecter – Nettoyage',
      maintenance: 'Affecter – Maintenance',
      guest: 'Attribuer à un client',
    };
    const a = this.action();
    return a ? (map[a] ?? 'Gestion chambre') : 'Gestion chambre';
  }

  setAction(a: ModalAction): void {
    this.selectedCleaningStaff = '';
    this.selectedMaintenanceStaff = '';
    this.maintenanceNotes = '';
    this.guestName = '';
    this.guestEmail = '';
    this.guestPhone = '';
    this.guestCheckIn = new Date().toISOString().split('T')[0];
    this.guestCheckOut = '';
    this.action.set(a);
  }

  onOverlayClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  doAssignCleaning(): void {
    if (!this.selectedCleaningStaff) {
      alert('Veuillez choisir un agent.');
      return;
    }

    this.isLoading.set(true);
    this.roomService.assignCleaning(this.room.id, {
      staff: this.selectedCleaningStaff
    }).subscribe({
      next: () => {
        this.actionDone.emit({
          message: `🧹 Chambre ${this.room.number} assignée à ${this.selectedCleaningStaff}`,
          color: 'amber',
        });
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        alert('Erreur lors de l\'assignation');
      },
      complete: () => this.isLoading.set(false),
    });
  }

  doAssignMaintenance(): void {
    if (!this.selectedMaintenanceStaff) {
      alert('Veuillez choisir un technicien.');
      return;
    }

    this.isLoading.set(true);
    this.roomService.assignMaintenance(this.room.id, {
      staff: this.selectedMaintenanceStaff,
      notes: this.maintenanceNotes || undefined
    }).subscribe({
      next: () => {
        this.actionDone.emit({
          message: `🔧 Chambre ${this.room.number} en maintenance`,
          color: 'red',
        });
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        alert('Erreur lors de l\'assignation');
      },
      complete: () => this.isLoading.set(false),
    });
  }

  doAssignGuest(): void {
    if (!this.guestName || !this.guestCheckIn || !this.guestCheckOut) {
      alert('Veuillez remplir les champs obligatoires (*).');
      return;
    }

    if (this.guestCheckOut <= this.guestCheckIn) {
      alert("La date de départ doit être après la date d'arrivée.");
      return;
    }

    const guest: Guest = {
      name: this.guestName,
      email: this.guestEmail,
      phone: this.guestPhone,
      checkIn: this.guestCheckIn,
      checkOut: this.guestCheckOut,
    };

    this.isLoading.set(true);
    this.roomService.assignGuest(this.room.id, guest).subscribe({
      next: () => {
        this.actionDone.emit({
          message: `🔑 Chambre attribuée à ${this.guestName}`,
          color: 'blue',
        });
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        alert('Erreur lors de l\'assignation');
      },
      complete: () => this.isLoading.set(false),
    });
  }

  doCheckout(): void {
    const name = this.room.guest?.name ?? '';
    this.isLoading.set(true);
    this.roomService.checkout(this.room.id).subscribe({
      next: () => {
        this.actionDone.emit({
          message: `✅ Check-out de ${name}`,
          color: 'amber',
        });
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        alert('Erreur lors du check-out');
      },
      complete: () => this.isLoading.set(false),
    });
  }

  doMarkAvailable(): void {
    this.isLoading.set(true);
    this.roomService.markAvailable(this.room.id).subscribe({
      next: () => {
        this.actionDone.emit({
          message: `✅ Chambre marquée disponible`,
          color: 'green',
        });
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        alert('Erreur lors de la mise à jour');
      },
      complete: () => this.isLoading.set(false),
    });
  }
}