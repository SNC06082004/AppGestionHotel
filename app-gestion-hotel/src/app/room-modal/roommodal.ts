
import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChambreService } from '../services/chambre.service';
import { Room, Guest, ActionEvent } from '../models/chambre.model';
type ModalAction = null | 'cleaning' | 'maintenance' | 'guest';
@Component({
  selector: 'app-roommodal',
  imports: [CommonModule, FormsModule],
  templateUrl: './roommodal.html',
  styleUrl: './roommodal.css',
})
export class Roommodal {
 @Input({ required: true }) room!: Room;
  @Output() close       = new EventEmitter<void>();
  @Output() actionDone  = new EventEmitter<ActionEvent>();
 
  private roomService = inject(ChambreService);
 
  action = signal<ModalAction>(null);
 
  // Champs formulaire nettoyage
  cleaningStaff = '';
 
  // Champs formulaire maintenance
  maintenanceStaff = '';
  maintenanceNotes = '';
 
  // Champs formulaire client
  guestName     = '';
  guestEmail    = '';
  guestPhone    = '';
  guestCheckIn  = new Date().toISOString().split('T')[0];
  guestCheckOut = '';
 
  readonly staffList: string[] = [
    'Marie Diallo',
    'Fatou Kone',
    'Ibrahim Sawadogo',
    'Kofi Mensah',
    'Salif Ouédraogo',
    'Aïcha Barry',
  ];
 
  get statusLabel(): string {
    const map: Record<string, string> = {
      available:   'Disponible',
      occupied:    'Occupée',
      cleaning:    'En nettoyage',
      maintenance: 'En maintenance',
    };
    return map[this.room.status] ?? this.room.status;
  }
 
  get actionTitle(): string {
    const map: Record<string, string> = {
      cleaning:    'Affecter – Nettoyage',
      maintenance: 'Affecter – Maintenance',
      guest:       'Attribuer à un client',
    };
    const a = this.action();
    return a ? (map[a] ?? 'Gestion chambre') : 'Gestion chambre';
  }
 
  setAction(a: ModalAction): void {
    this.cleaningStaff    = '';
    this.maintenanceStaff = '';
    this.maintenanceNotes = '';
    this.guestName        = '';
    this.guestEmail       = '';
    this.guestPhone       = '';
    this.guestCheckIn     = new Date().toISOString().split('T')[0];
    this.guestCheckOut    = '';
    this.action.set(a);
  }
 
  onOverlayClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
 
  doAssignCleaning(): void {
    if (!this.cleaningStaff) { alert('Veuillez choisir un agent.'); return; }
    this.roomService.assignCleaning(this.room.id, this.cleaningStaff);
    this.actionDone.emit({
      message: `🧹 Chambre ${this.room.number} assignée à ${this.cleaningStaff} pour nettoyage`,
      color: 'amber',
    });
    this.close.emit();
  }
 
  doAssignMaintenance(): void {
    if (!this.maintenanceStaff) { alert('Veuillez choisir un technicien.'); return; }
    this.roomService.assignMaintenance(
      this.room.id,
      this.maintenanceStaff,
      this.maintenanceNotes || undefined,
    );
    this.actionDone.emit({
      message: `🔧 Chambre ${this.room.number} en maintenance – ${this.maintenanceStaff}`,
      color: 'red',
    });
    this.close.emit();
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
      name:     this.guestName,
      email:    this.guestEmail,
      phone:    this.guestPhone,
      checkIn:  this.guestCheckIn,
      checkOut: this.guestCheckOut,
    };
    this.roomService.assignGuest(this.room.id, guest);
    this.actionDone.emit({
      message: `🔑 Chambre ${this.room.number} attribuée à ${this.guestName}`,
      color: 'blue',
    });
    this.close.emit();
  }
 
  doCheckout(): void {
    const name = this.room.guest?.name ?? '';
    this.roomService.checkout(this.room.id);
    this.actionDone.emit({
      message: `✅ Check-out de ${name} – Chambre ${this.room.number} en nettoyage`,
      color: 'amber',
    });
    this.close.emit();
  }
 
  doMarkAvailable(): void {
    this.roomService.markAvailable(this.room.id);
    this.actionDone.emit({
      message: `✅ Chambre ${this.room.number} marquée disponible`,
      color: 'green',
    });
    this.close.emit();
  }
}
