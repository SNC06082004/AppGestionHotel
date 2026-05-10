// src/app/models/depart.model.ts
// Correspond à DepartDuJourDTO.java

export interface DepartDuJourDTO {
  reservationId: number;
  clientId: number;
  clientNom: string;
  clientTelephone?: string;
  clientEmail?: string;
  numeroChambre: string;
  typeChambre: string;
  statutChambre: string;
  checkIn: string;
  checkOut: string;
  departEffectue: boolean;
}