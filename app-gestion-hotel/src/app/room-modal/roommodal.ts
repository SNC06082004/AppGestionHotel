import { Component, EventEmitter, inject, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChambreService } from '../services/chambre.service';
import { PersonnelService } from '../services/personnel.service';
import { Room, Guest, ActionEvent } from '../models/chambre.model';
import { ClientService } from '../client.service';

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

    // ────── CLIENT (nouveau) ──────
  clients = signal<any[]>([]);
  filteredClients = signal<any[]>([]);
  clientSearchTerm = '';
  selectedClient: any = null;
  showClientDropdown = false;
  guestCheckIn = new Date().toISOString().split('T')[0];
  guestCheckOut = '';

  private clientService = inject(ClientService); // ✅ Ajouter

  ngOnInit(): void {
    this.loadPersonnel();
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        console.log('👥 Clients chargés:', clients);
        this.clients.set(clients);
        this.filteredClients.set(clients);
      },
      error: (err) => console.error('❌ Erreur clients:', err)
    });
  }

  onClientSearch(): void {
    const term = this.clientSearchTerm.toLowerCase();
    if (!term) {
      this.filteredClients.set(this.clients());
    } else {
      this.filteredClients.set(
        this.clients().filter(c =>
          c.nom.toLowerCase().includes(term) ||
          c.prenom.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term)
        )
      );
    }
    this.showClientDropdown = true;
    this.selectedClient = null;
  }

  selectClient(client: any): void {
    this.selectedClient = client;
    this.clientSearchTerm = `${client.prenom} ${client.nom}`;
    this.showClientDropdown = false;
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
  // ✅ Remplacer les anciens champs par les nouveaux
  this.clientSearchTerm = '';
  this.selectedClient = null;
  this.showClientDropdown = false;
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
    personnelId: Number(this.selectedCleaningStaff)  // ✅ Conversion string → number
  }).subscribe({
    next: () => {
      this.actionDone.emit({ message: `🧹 Nettoyage assigné`, color: 'amber' });
      this.close.emit();
    },
    error: (err) => { console.error(err); alert('Erreur'); },
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
    personnelId: Number(this.selectedMaintenanceStaff),  // ✅ Conversion string → number
    notes: this.maintenanceNotes || undefined
  }).subscribe({
    next: () => {
      this.actionDone.emit({ message: `🔧 Maintenance assignée`, color: 'red' });
      this.close.emit();
    },
    error: (err) => { console.error(err); alert('Erreur'); },
    complete: () => this.isLoading.set(false),
  });
}


 // ✅ Modifier doAssignGuest pour envoyer clientId
  doAssignGuest(): void {
    if (!this.selectedClient || !this.guestCheckIn || !this.guestCheckOut) {
      alert('Veuillez sélectionner un client et les dates.');
      return;
    }
    if (this.guestCheckOut <= this.guestCheckIn) {
      alert("La date de départ doit être après la date d'arrivée.");
      return;
    }

    this.isLoading.set(true);
    this.roomService.assignGuest(this.room.id, {
      clientId: this.selectedClient.id,
      checkIn: this.guestCheckIn,
      checkOut: this.guestCheckOut,
    }).subscribe({
      next: () => {
        this.actionDone.emit({
          message: `🔑 Chambre attribuée à ${this.selectedClient.prenom} ${this.selectedClient.nom}`,
          color: 'blue',
        });
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        alert("Erreur lors de l'assignation");
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

