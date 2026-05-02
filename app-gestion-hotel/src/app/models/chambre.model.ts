// src/app/models/chambre.model.ts

// ============================================================================
// ENUMS / TYPES
// ============================================================================

export type RoomType = 
  'SIMPLE' | 'DOUBLE' | 'SUITE' | 'FAMILIALE' | 'DELUXE' | 'PRESIDENTIELLE';

export type RoomStatus = 
  'DISPONIBLE' | 'OCCUPEE' | 'EN_NETTOYAGE' | 'EN_MAINTENANCE' | 'RESERVEE';

// Alias pour compatibilité avec l'ancien code (addchambre etc.)
export type RoomStatut = RoomStatus;

// ============================================================================
// INTERFACES
// ============================================================================

export interface Guest {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
}

export interface Room {
  id: number;
  number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  price: number;
  staff?: string;
  notes?: string;
  guest?: Guest;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomStats {
  total: number;
  disponible: number;
  occupee: number;
  en_nettoyage: number;
  en_maintenance: number;
}

export interface RoomTypeOption {
  value: RoomType;
  label: string;
  displayName: string;
}

export interface RoomStatusOption {
  value: RoomStatus;
  label: string;
  color: 'green' | 'blue' | 'amber' | 'red';
  emoji: string;
}

// ============================================================================
// DTOs — Communication avec le backend
// ============================================================================

export interface CreateRoomRequest {
  number: string;
  floor: number;
  type: RoomType;
  capacity: number;
  price: number;
  staff?: string;
  notes?: string;
}

export interface UpdateRoomRequest {
  number?: string;
  floor?: number;
  type?: RoomType;
  capacity?: number;
  price?: number;
  status?: RoomStatus;
  staff?: string;
  notes?: string;
}

export interface AssignCleaningRequest {
  staff: string;
}

export interface AssignMaintenanceRequest {
  staff: string;
  notes?: string;
}

export interface AssignGuestRequest {
  guest: Guest;
}

// Alias pour l'ancien code qui utilisait Chambre/CreateChambreRequest
export interface Chambre extends Room {}

export interface CreateChambreRequest extends CreateRoomRequest {}

export interface UpdateChambreRequest extends UpdateRoomRequest {}

// ============================================================================
// EVENTS
// ============================================================================

export interface ActionEvent {
  message: string;
  color: 'green' | 'amber' | 'blue' | 'red';
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const ROOM_TYPES: RoomTypeOption[] = [
  { value: 'SIMPLE',          label: 'Chambre Simple',       displayName: 'Simple'         },
  { value: 'DOUBLE',          label: 'Chambre Double',       displayName: 'Double'         },
  { value: 'SUITE',           label: 'Suite',                displayName: 'Suite'          },
  { value: 'FAMILIALE',       label: 'Chambre Familiale',    displayName: 'Familiale'      },
  { value: 'DELUXE',          label: 'Chambre Deluxe',       displayName: 'Deluxe'         },
  { value: 'PRESIDENTIELLE',  label: 'Suite Présidentielle', displayName: 'Présidentielle' },
];

export const ROOM_STATUSES: RoomStatusOption[] = [
  { value: 'DISPONIBLE',    label: '🟢 Disponible',      color: 'green', emoji: '🟢' },
  { value: 'OCCUPEE',       label: '🔵 Occupée',         color: 'blue',  emoji: '🔵' },
  { value: 'EN_NETTOYAGE',  label: '🟡 En nettoyage',   color: 'amber', emoji: '🟡' },
  { value: 'EN_MAINTENANCE',label: '🔴 En maintenance',  color: 'red',   emoji: '🔴' },
  { value: 'RESERVEE',      label: '🟣 Réservée',        color: 'blue',  emoji: '🟣' },
];

export const ROOM_STATUTS: { value: RoomStatus; label: string }[] = [
  { value: 'DISPONIBLE',     label: 'Disponible'      },
  { value: 'OCCUPEE',        label: 'Occupée'         },
  { value: 'EN_NETTOYAGE',   label: 'En nettoyage'   },
  { value: 'EN_MAINTENANCE', label: 'En maintenance'  },
  { value: 'RESERVEE',       label: 'Réservée'        },
];

// ============================================================================
// HELPERS
// ============================================================================

export function getRoomTypeLabel(type: RoomType): string {
  return ROOM_TYPES.find(t => t.value === type)?.label ?? type;
}

export function getRoomStatusLabel(status: RoomStatus): string {
  return ROOM_STATUSES.find(s => s.value === status)?.label ?? status;
}

export function getRoomStatusColor(status: RoomStatus): 'green' | 'blue' | 'amber' | 'red' {
  return ROOM_STATUSES.find(s => s.value === status)?.color ?? 'green';
}