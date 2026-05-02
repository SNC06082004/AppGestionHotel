  // src/app/components/add-chambre/add-chambre.component.ts

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChambreService } from '../services/chambre.service';
import { Chambre, CreateChambreRequest, ROOM_TYPES } from '../models/chambre.model';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addchambre.html',
  styleUrls: ['./addchambre.css'],
})
export class Addchambre implements OnInit {
    
  @Output() chambreAjoutee = new EventEmitter<Chambre>();
  @Output() annuler = new EventEmitter<void>();
  
  chambreForm!: FormGroup;
  isLoading = false;
  roomTypes = ROOM_TYPES;
  
  constructor(
    private fb: FormBuilder,
    private chambreService: ChambreService
  ) {}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  /**
   * Initialiser le formulaire avec les validations
   */
  private initializeForm(): void {
    this.chambreForm = this.fb.group({
      number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      floor: [null, [Validators.required, Validators.min(0)]],
      type: ['', Validators.required],
      capacity: [null, [Validators.required, Validators.min(1), Validators.max(20)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      staff: ['', Validators.maxLength(100)],
      notes: ['', Validators.maxLength(500)],
    });
  }
  
  /**
   * Vérifier si un champ est invalide
   */
  isFieldInvalid(field: string): boolean {
    const control = this.chambreForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  /**
   * Vérifier si un champ est valide
   */
  isFieldValid(field: string): boolean {
    const control = this.chambreForm.get(field);
    return !!(control && control.valid && (control.dirty || control.touched));
  }
  
  /**
   * Soumettre le formulaire
   */
  onSubmit(): void {
    if (this.chambreForm.invalid) {
      this.chambreForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    
    const formValues = this.chambreForm.value;
    const createRequest: CreateChambreRequest = {
      number: formValues.number.trim(),
      floor: Number(formValues.floor),
      type: formValues.type,
      capacity: Number(formValues.capacity),
      price: Number(formValues.price),
      staff: formValues.staff?.trim() || undefined,
      notes: formValues.notes?.trim() || undefined,
    };
    
  //   this.chambreService.createChambre(createRequest).subscribe({
  //     next: (chambre: Chambre) => {
  //       this.chambreAjoutee.emit(chambre);
  //       this.resetForm();
  //       this.isLoading = false;
  //     },
  //     error: (error: any) => {
  //       console.error('Erreur lors de la création de la chambre:', error);
  //       this.isLoading = false;
  //       // TODO: Afficher un message d'erreur à l'utilisateur
  //     }
  //   });
  // }
  
  /**
   * Annuler l'ajout
   */
  // onCancel(): void {
  //   this.annuler.emit();
  //   this.resetForm();
  // }
  
  // /**
  //  * Réinitialiser le formulaire
  //  */
  // private resetForm(): void {
  //   this.chambreForm.reset();
  //   this.chambreForm.markAsUntouched();
  // }
}
}
