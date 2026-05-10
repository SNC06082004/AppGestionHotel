// src/app/models/fidelite.model.ts
// Correspond à CarteFideliteDTO.java

export type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface CarteFideliteDTO {
  id?: number;
  clientId: number;
  clientNom: string;
  initiales: string;
  numero: string;
  tier: Tier;
  points: number;
  palierSuivant: number;
  sejours: number;
  membreDepuis: string;
}

export interface AjoutPointsRequest {
  points: number;
}