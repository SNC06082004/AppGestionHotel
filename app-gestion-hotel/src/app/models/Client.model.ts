// models/client.model.ts

export interface InscriptionRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse: string;
}

export interface InscriptionResponse {
  succes: boolean;
  message: string;
  idUtilisateur: number | null;
}