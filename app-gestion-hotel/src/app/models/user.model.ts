//user.model.ts
export interface UserDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  userType?: 'CLIENT' | 'PERSONNEL' | 'RECEPTIONNISTE' | 'ADMIN';
}

export interface UpdateUserRequestDTO {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  roleAffectation?: string; 
}

export interface CreateUserRequestDTO extends UpdateUserRequestDTO {
  motDePasse: string;
  userType: 'CLIENT' | 'PERSONNEL' | 'RECEPTIONNISTE' | 'ADMIN';
}