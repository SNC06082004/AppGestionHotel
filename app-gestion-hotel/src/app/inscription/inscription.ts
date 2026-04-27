import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { InscriptionRequest } from '../models/Client.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription implements OnInit {

  inscriptionForm!: FormGroup;
  isLoading: boolean = false;
  messageErreur: string = '';
  messageSucces: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inscriptionForm = this.fb.group({
      nom: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      prenom: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      telephone: ['', [
        Validators.required,
        Validators.pattern(/^\+?[0-9\s]{8,15}$/)
      ]],
      motDePasse: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  // Raccourci pour accéder facilement aux champs dans le template
  get f() {
    return this.inscriptionForm.controls;
  }

  // Vérifie si un champ est invalide ET a été touché (pour afficher l'erreur)
  isInvalid(champ: string): boolean {
    const control = this.f[champ];
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher toutes les erreurs
    this.inscriptionForm.markAllAsTouched();

    if (this.inscriptionForm.invalid) return;

    this.messageErreur = '';
    this.messageSucces = '';
    this.isLoading = true;

    const payload: InscriptionRequest = this.inscriptionForm.value;

    this.authService.inscrire(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageSucces = 'Inscription réussie ! Redirection en cours...';
        setTimeout(() => this.router.navigate(['/connexion']), 1500);
      },
      error: (err: { status: number; error: { message: string; }; }) => {
        this.isLoading = false;
        console.error('Erreur inscription:', err);
        
        if (err.status === 409) {
          // Email déjà utilisé
          this.f['email'].setErrors({ emailExistant: true });
        } else if (err.error?.message) {
          this.messageErreur = err.error.message;
        } else {
          this.messageErreur = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}