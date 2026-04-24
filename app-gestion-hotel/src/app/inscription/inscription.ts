// inscription/inscription.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { InscriptionRequest } from '../models/Client.model';


@Component({
  selector: 'app-inscription',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {

  nom: string = '';
  prenom: string = '';
  email: string = '';
  telephone: string = '';
  motDePasse: string = '';

  isLoading: boolean = false;
  messageErreur: string = '';
  messageSucces: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.isLoading = true;

    const payload: InscriptionRequest = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      motDePasse: this.motDePasse
    };

    this.authService.inscrire(payload).subscribe({
      next: (response: { succes: any; message: string; }) => {
        this.isLoading = false;
        if (response.succes) {
          this.messageSucces = response.message;
          setTimeout(() => this.router.navigate(['/connexion']), 1500);
        } else {
          this.messageErreur = response.message;
        }
      },
      error: (err: { status: number; error: { message: string; }; }) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.messageErreur = err.error?.message || 'Cet email est deja utilise.';
        } else {
          this.messageErreur = 'Une erreur est survenue. Veuillez reessayer.';
        }
      }
    });
  }
}