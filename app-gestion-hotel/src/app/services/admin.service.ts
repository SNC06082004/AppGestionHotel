import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environnement';
import { UpdateUserRequestDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`);
  }

  // Récupérer les utilisateurs par type
  getUsersByType(type: 'CLIENT' | 'PERSONNEL' | 'RECEPTIONNISTE' | 'ADMIN'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users/type/${type}`);
  }

  // Créer un utilisateur
  createUser(user: UpdateUserRequestDTO, userType: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/admin/users?userType=${userType}`, 
      user
    );
  }

  // Modifier un utilisateur
  updateUser(id: number, user: UpdateUserRequestDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/users/${id}`, user);
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`);
  }

  // Créer un administrateur
  createAdmin(user: UpdateUserRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/create-admin`, user);
  }
}