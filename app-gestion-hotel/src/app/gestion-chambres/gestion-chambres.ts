import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ChambreService } from '../services/chambre.service';
import { Room, RoomType, ROOM_TYPES, CreateChambreRequest } from '../models/chambre.model';

@Component({
  selector: 'app-gestion-chambres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gestion-chambres.html',
  styleUrls: ['./gestion-chambres.css'],
})
export class GestionChambres implements OnInit {

  // ── ÉTAT ──
  rooms = signal<Room[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  showForm = signal(false);
  editingRoom = signal<Room | null>(null);
  searchTerm = '';
  confirmDeleteId: number | null = null;
  successMessage = '';
  errorMessage = '';

  // ── FORM ──
  chambreForm!: FormGroup;
  roomTypes = ROOM_TYPES;

  // ── STATS ──
  stats = computed(() => {
    const r = this.rooms();
    const byType: Record<string, number> = {};
    r.forEach(room => {
      byType[room.type] = (byType[room.type] || 0) + 1;
    });
    return { total: r.length, byType };
  });

  // ── FILTRAGE ──
  filteredRooms = computed(() => {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.rooms();
    return this.rooms().filter(r =>
      r.number.toLowerCase().includes(term) ||
      r.type.toLowerCase().includes(term) ||
      String(r.floor).includes(term)
    );
  });

  constructor(
    private fb: FormBuilder,
    private chambreService: ChambreService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRooms();
  }

  private initForm(room?: Room): void {
    this.chambreForm = this.fb.group({
      number: [room?.number ?? '', [Validators.required, Validators.maxLength(50)]],
      floor:  [room?.floor  ?? null, [Validators.required, Validators.min(0)]],
      type:   [room?.type   ?? '', Validators.required],
      capacity: [room?.capacity ?? null, [Validators.required, Validators.min(1), Validators.max(20)]],
      price:  [room?.price  ?? null, [Validators.required, Validators.min(1)]],
      staff:  [room?.staff  ?? ''],
      notes:  [room?.notes  ?? '', Validators.maxLength(500)],
    });
  }

  loadRooms(): void {
    this.isLoading.set(true);
    this.chambreService['http'].get<Room[]>('http://localhost:8080/api/chambres').subscribe({
      next: (rooms) => { this.rooms.set(rooms); this.isLoading.set(false); },
      error: () => { this.showError('Erreur lors du chargement'); this.isLoading.set(false); }
    });
  }

  openCreate(): void {
    this.editingRoom.set(null);
    this.initForm();
    this.showForm.set(true);
  }

  openEdit(room: Room): void {
    this.editingRoom.set(room);
    this.initForm(room);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingRoom.set(null);
    this.chambreForm.reset();
  }

  onSubmit(): void {
    if (this.chambreForm.invalid) {
      this.chambreForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const v = this.chambreForm.value;
    const editing = this.editingRoom();

    const payload: CreateChambreRequest = {
      number:   v.number.trim(),
      floor:    Number(v.floor),
      type:     v.type,
      capacity: Number(v.capacity),
      price:    Number(v.price),
      staff:    v.staff?.trim() || undefined,
      notes:    v.notes?.trim() || undefined,
    };

    if (editing) {
      this.chambreService.updateChambre(editing.id, payload).subscribe({
        next: (updated) => {
          this.rooms.update(list => list.map(r => r.id === editing.id ? updated : r));
          this.showSuccess('Chambre modifiée avec succès');
          this.closeForm();
          this.isSubmitting.set(false);
        },
        error: () => { this.showError('Erreur lors de la modification'); this.isSubmitting.set(false); }
      });
    } else {
      this.chambreService.createChambre(payload).subscribe({
        next: (created) => {
          this.rooms.update(list => [...list, created]);
          this.showSuccess('Chambre créée avec succès');
          this.closeForm();
          this.isSubmitting.set(false);
        },
        error: () => { this.showError('Erreur lors de la création'); this.isSubmitting.set(false); }
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  deleteRoom(): void {
    if (this.confirmDeleteId === null) return;
    const id = this.confirmDeleteId;
    this.chambreService.deleteChambre(id).subscribe({
      next: () => {
        this.rooms.update(list => list.filter(r => r.id !== id));
        this.showSuccess('Chambre supprimée');
        this.confirmDeleteId = null;
      },
      error: () => { this.showError('Erreur lors de la suppression'); this.confirmDeleteId = null; }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.chambreForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  isValid(field: string): boolean {
    const c = this.chambreForm.get(field);
    return !!(c && c.valid && (c.dirty || c.touched));
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3500);
  }

  private showError(msg: string): void {
    this.errorMessage = msg;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 4000);
  }

  getTypeLabel(type: string): string {
    return ROOM_TYPES.find(t => t.value === type)?.displayName ?? type;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      DISPONIBLE: 'status-green',
      OCCUPEE: 'status-blue',
      EN_NETTOYAGE: 'status-amber',
      EN_MAINTENANCE: 'status-red',
      RESERVEE: 'status-purple',
    };
    return map[status] ?? 'status-grey';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      DISPONIBLE: 'Disponible',
      OCCUPEE: 'Occupée',
      EN_NETTOYAGE: 'Nettoyage',
      EN_MAINTENANCE: 'Maintenance',
      RESERVEE: 'Réservée',
    };
    return map[status] ?? status;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }
}