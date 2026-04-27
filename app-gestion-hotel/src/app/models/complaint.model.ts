export interface ComplaintRequest {
  clientId: number;
  type: 'complaint' | 'special-request';
  priority?: string;
  preferenceType?: string;
  subject?: string;
  details: string;
  requestedDate?: string;
  status: string;
}

export interface ComplaintResponse {
  id?: string;
  clientId: number;
  clientName: string;
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

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
}