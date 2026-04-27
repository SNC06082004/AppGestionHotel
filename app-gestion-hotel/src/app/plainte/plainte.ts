import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { PlaintesService } from '../services/plaintes.service';
import { ComplaintRequest } from '../models/complaint.model';

@Component({
  selector: 'app-plainte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './plainte.html',
  styleUrls: ['./plainte.css'],
  providers: [PlaintesService]
})
export class Plainte implements OnInit, OnDestroy {
  complaintForm!: FormGroup;
  specialRequestForm!: FormGroup;
  activeTab: 'complaint' | 'request' = 'complaint';
  
  currentUser: any = null;
  priorities = ['Normale', 'Haute', 'Urgente'];
  preferenceTypes = [
    'Préférence alimentaire',
    'Arrangement chambre',
    'Services spéciaux',
    'Autre'
  ];
  
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private plaintesService: PlaintesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        
        // Si l'utilisateur n'est pas connecté, rediriger vers connexion
        if (!user) {
          console.warn('⚠️ Utilisateur non connecté. Redirection vers connexion...');
          this.router.navigate(['/connexion']);
          return;
        }
        
        console.log('✅ Utilisateur connecté:', user);
      });

    this.initializeFormulaires();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  initializeFormulaires(): void {
    // Formulaire de plainte
    this.complaintForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      priority: ['Normale', Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Formulaire de demande spéciale
    this.specialRequestForm = this.fb.group({
      preferenceType: ['', Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]],
      requestedDate: ['', Validators.required]
    });
  }

  // Accesseur pour les contrôles du formulaire
  get fComplaint() {
    return this.complaintForm.controls;
  }

  get fSpecialRequest() {
    return this.specialRequestForm.controls;
  }

  // Vérifier si un champ est invalide et touché
  isComplaintInvalid(champ: string): boolean {
    const control = this.fComplaint[champ];
    return control?.invalid && (control?.dirty || control?.touched);
  }

  isRequestInvalid(champ: string): boolean {
    const control = this.fSpecialRequest[champ];
    return control?.invalid && (control?.dirty || control?.touched);
  }

  submitComplaint(): void {
    // Marquer tous les champs comme touchés
    this.complaintForm.markAllAsTouched();

    if (this.complaintForm.invalid || !this.currentUser) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const formData = this.complaintForm.value;

    // ✅ Créer l'objet plainte avec les données de l'utilisateur connecté
    const complaint: ComplaintRequest = {
      clientId: this.currentUser.id,
      type: 'complaint',
      subject: formData.subject,
      details: formData.details,
      priority: formData.priority,
      status: 'En attente' // ✅ Status par défaut
    };

    console.log('📦 Plainte à envoyer:', complaint);

    this.plaintesService.createPlainte(complaint).subscribe({
      next: (response) => {
        console.log('✅ Plainte enregistrée avec succès:', response);
        this.successMessage = 'Votre plainte a été enregistrée avec succès!';
        this.complaintForm.reset();
        this.complaintForm.patchValue({ priority: 'Normale' });
        this.isSubmitting = false;
        
        // Masquer le message après 3 secondes
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'enregistrement:', err);
        this.errorMessage = 'Erreur lors de l\'enregistrement: ' + 
                           (err.error?.message || err.statusText || 'Erreur inconnue');
        this.isSubmitting = false;
      }
    });
  }

  submitSpecialRequest(): void {
    // Marquer tous les champs comme touchés
    this.specialRequestForm.markAllAsTouched();

    if (this.specialRequestForm.invalid || !this.currentUser) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const formData = this.specialRequestForm.value;

    // ✅ Créer l'objet demande spéciale avec les données de l'utilisateur connecté
    const request: ComplaintRequest = {
      clientId: this.currentUser.id,
      type: 'special-request',
      preferenceType: formData.preferenceType,
      details: formData.details,
      requestedDate: formData.requestedDate,
      status: 'En attente' // ✅ Status par défaut
    };

    console.log('📦 Demande spéciale à envoyer:', request);

    this.plaintesService.createPlainte(request).subscribe({
      next: (response) => {
        console.log('✅ Demande enregistrée avec succès:', response);
        this.successMessage = 'Votre demande spéciale a été enregistrée avec succès!';
        this.specialRequestForm.reset();
        this.isSubmitting = false;
        
        // Masquer le message après 3 secondes
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'enregistrement:', err);
        this.errorMessage = 'Erreur lors de l\'enregistrement: ' + 
                           (err.error?.message || err.statusText || 'Erreur inconnue');
        this.isSubmitting = false;
      }
    });
  }

  switchTab(tab: 'complaint' | 'request'): void {
    this.activeTab = tab;
    // Réinitialiser les messages
    this.errorMessage = '';
    this.successMessage = '';
  }
}