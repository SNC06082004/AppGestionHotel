export interface InscriptionRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
}

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
}

// ✅ Ajouter ces exports manquants
export interface InscriptionResponse extends AuthResponse {}
export interface LoginResponse extends AuthResponse {}

// src/app/models/client.model.ts
// Correspond à ClientDTO.java

export interface ClientDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  chambreActive?: string;   // numéro chambre de la résa active (null si aucune)
  checkIn?: string;
  checkOut?: string;
  nombreSejours?: number;
}