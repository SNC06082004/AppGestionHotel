// src/app/models/complaint.model.ts
export interface ComplaintDTO {
  id?: number;
  clientId: number;
  clientName?: string;
  type: 'complaint' | 'special-request';
  priority?: string;
  preferenceType?: string;
  subject?: string;
  details: string;
  requestedDate?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Alias rétrocompatibles — id est maintenant number (pas string)
export type ComplaintRequest  = Omit<ComplaintDTO, 'id' | 'clientName' | 'createdAt' | 'updatedAt'>;
export type ComplaintResponse = ComplaintDTO;

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
}