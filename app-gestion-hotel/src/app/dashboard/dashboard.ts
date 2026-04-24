import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChambreService } from '../services/chambre.service';
import { Sidebar } from '../sidebar/sidebar';
import { Roomcard } from '../room-card/roomcard';
import { Roommodal } from '../room-modal/roommodal';
import { Room, RoomStatus, ActionEvent } from '../models/chambre.model';
interface Toast {
  id: number;
  message: string;
  color: 'green' | 'amber' | 'blue' | 'red';
}
 
interface FilterOption {
  value: RoomStatus | 'all';
  label: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar,Roommodal,Roomcard,CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
private roomService = inject(ChambreService);
 
  currentFilter = signal<RoomStatus | 'all'>('all');
  selectedRoom  = signal<Room | null>(null);
  toasts        = signal<Toast[]>([]);
  private toastId = 0;
 
  readonly filterOptions: FilterOption[] = [
    { value: 'all',         label: 'Tout' },
    { value: 'available',   label: '🟢 Dispo' },
    { value: 'occupied',    label: '🔵 Occupé' },
    { value: 'cleaning',    label: '🟡 Nettoyage' },
    { value: 'maintenance', label: '🔴 Maintenance' },
  ];
 
  floors = computed<number[]>(() =>
    this.roomService.getFloors(this.currentFilter())
  );
 
  get filteredCount(): number {
    return this.roomService.getFilteredRooms(this.currentFilter()).length;
  }
 
  get pageTitle(): string {
    const titles: Record<string, string> = {
      all:         'Toutes les chambres',
      available:   'Chambres disponibles',
      occupied:    'Chambres occupées',
      cleaning:    'En cours de nettoyage',
      maintenance: 'En cours de maintenance',
    };
    return titles[this.currentFilter()] ?? 'Chambres';
  }
 
  roomsByFloor(floor: number): Room[] {
    return this.roomService.getRoomsByFloor(floor, this.currentFilter());
  }
 
  openModal(room: Room): void {
    this.selectedRoom.set(room);
  }
 
  closeModal(): void {
    this.selectedRoom.set(null);
  }
 
  onActionDone(event: ActionEvent): void {
    const id = ++this.toastId;
    this.toasts.update(list => [...list, { id, ...event }]);
    setTimeout(() => {
      this.toasts.update(list => list.filter(t => t.id !== id));
    }, 3500);
  }
}
