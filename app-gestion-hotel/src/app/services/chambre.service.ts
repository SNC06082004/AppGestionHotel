import { Injectable, signal, computed } from '@angular/core';
import { Room, RoomStatus, Guest, RoomStats } from '../models/chambre.model';

@Injectable({ providedIn: 'root' })
export class ChambreService {

  private _rooms = signal<Room[]>([
    { id: '1',  number: '101', floor: 1, type: 'Chambre Simple', status: 'available',   capacity: 1, price: 75 },
    { id: '2',  number: '102', floor: 1, type: 'Chambre Simple', status: 'cleaning',    capacity: 1, price: 75,  staff: 'Marie Diallo' },
    { id: '3',  number: '103', floor: 1, type: 'Chambre Double', status: 'occupied',    capacity: 2, price: 120,
      guest: { name: 'Jean Martin', email: 'jean@email.com', phone: '+226 70 000 001', checkIn: '2026-04-16', checkOut: '2026-04-20' } },
    { id: '4',  number: '104', floor: 1, type: 'Chambre Double', status: 'maintenance', capacity: 2, price: 120, staff: 'Kofi Mensah', notes: 'Robinet cassé' },
    { id: '5',  number: '201', floor: 2, type: 'Chambre Double', status: 'available',   capacity: 2, price: 130 },
    { id: '6',  number: '202', floor: 2, type: 'Suite',          status: 'occupied',    capacity: 4, price: 250,
      guest: { name: 'Amina Ouédraogo', email: 'amina@email.com', phone: '+226 70 000 002', checkIn: '2026-04-15', checkOut: '2026-04-22' } },
    { id: '7',  number: '203', floor: 2, type: 'Chambre Deluxe', status: 'cleaning',    capacity: 2, price: 180, staff: 'Fatou Kone' },
    { id: '8',  number: '204', floor: 2, type: 'Chambre Deluxe', status: 'available',   capacity: 2, price: 180 },
    { id: '9',  number: '301', floor: 3, type: 'Suite',          status: 'available',   capacity: 4, price: 260 },
    { id: '10', number: '302', floor: 3, type: 'Suite',          status: 'maintenance', capacity: 4, price: 260, staff: 'Ibrahim Sawadogo', notes: 'Climatisation en panne' },
    { id: '11', number: '303', floor: 3, type: 'Chambre Deluxe', status: 'available',   capacity: 2, price: 190 },
    { id: '12', number: '304', floor: 3, type: 'Chambre Deluxe', status: 'occupied',    capacity: 2, price: 190,
      guest: { name: 'Paul Traoré', email: 'paul@email.com', phone: '+226 70 000 003', checkIn: '2026-04-17', checkOut: '2026-04-19' } },
  ]);

  readonly rooms = this._rooms.asReadonly();

  readonly stats = computed<RoomStats>(() => {
    const r = this._rooms();
    return {
      total:       r.length,
      available:   r.filter(x => x.status === 'available').length,
      occupied:    r.filter(x => x.status === 'occupied').length,
      cleaning:    r.filter(x => x.status === 'cleaning').length,
      maintenance: r.filter(x => x.status === 'maintenance').length,
    };
  });

  getFilteredRooms(filter: RoomStatus | 'all'): Room[] {
    const all = this._rooms();
    return filter === 'all' ? all : all.filter(r => r.status === filter);
  }

  getFloors(filter: RoomStatus | 'all'): number[] {
    return [...new Set(this.getFilteredRooms(filter).map(r => r.floor))].sort();
  }

  getRoomsByFloor(floor: number, filter: RoomStatus | 'all'): Room[] {
    return this.getFilteredRooms(filter).filter(r => r.floor === floor);
  }

  assignCleaning(roomId: string, staff: string): void {
    this._rooms.update(rooms =>
      rooms.map(r => r.id === roomId
        ? { ...r, status: 'cleaning' as RoomStatus, staff, guest: undefined, notes: undefined }
        : r)
    );
  }

  assignMaintenance(roomId: string, staff: string, notes?: string): void {
    this._rooms.update(rooms =>
      rooms.map(r => r.id === roomId
        ? { ...r, status: 'maintenance' as RoomStatus, staff, notes, guest: undefined }
        : r)
    );
  }

  assignGuest(roomId: string, guest: Guest): void {
    this._rooms.update(rooms =>
      rooms.map(r => r.id === roomId
        ? { ...r, status: 'occupied' as RoomStatus, guest, staff: undefined, notes: undefined }
        : r)
    );
  }

  checkout(roomId: string): void {
    this._rooms.update(rooms =>
      rooms.map(r => r.id === roomId
        ? { ...r, status: 'cleaning' as RoomStatus, guest: undefined, staff: undefined }
        : r)
    );
  }

  markAvailable(roomId: string): void {
    this._rooms.update(rooms =>
      rooms.map(r => r.id === roomId
        ? { ...r, status: 'available' as RoomStatus, guest: undefined, staff: undefined, notes: undefined }
        : r)
    );
  }
}