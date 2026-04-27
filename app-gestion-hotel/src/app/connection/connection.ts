import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './connection.html',
  styleUrl: './connection.css',
})
export class ConnectionC implements OnInit {

  connexionForm!: FormGroup;
  isLoading: boolean = false;
  messageErreur: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.connexionForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  get f() {
    return this.connexionForm.controls;
  }

  isInvalid(champ: string): boolean {
    const control = this.f[champ];
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.connexionForm.markAllAsTouched();

    if (this.connexionForm.invalid) return;

    this.messageErreur = '';
    this.isLoading = true;

    const { email, password } = this.connexionForm.value;

    this.authService.connexion(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Connexion réussie:', response);
        this.router.navigate(['/accueil']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Erreur connexion:', err);
        
        if (err.status === 401) {
          this.messageErreur = 'Email ou mot de passe incorrect';
        } else if (err.error?.message) {
          this.messageErreur = err.error.message;
        } else {
          this.messageErreur = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}