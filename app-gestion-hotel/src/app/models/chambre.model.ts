
export type RoomType = 'Chambre Simple' | 'Chambre Double' | 'Suite' | 'Chambre Deluxe';

export interface Guest {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  price: number;
  guest?: Guest;
  staff?: string;
  notes?: string;
}

export interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
}


// src/app/models/chambre.model.ts

// On définit les statuts possibles pour une chambre
export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

// Interface pour les notifications (Toasts) après une action
export interface ActionEvent {
  message: string;
  color: 'green' | 'amber' | 'blue' | 'red';
}

