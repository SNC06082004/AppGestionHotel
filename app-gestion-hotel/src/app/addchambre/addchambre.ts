import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export type RoomType = 'simple' | 'double' | 'suite' | 'familiale' | 'deluxe' | 'presidentielle';

export interface Chambre {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  capacity: number;
  price: number;
  staff?: string;
  notes?: string;
}

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

  roomTypes: { value: RoomType; label: string }[] = [
    { value: 'simple',         label: 'Chambre Simple' },
    { value: 'double',         label: 'Chambre Double' },
    { value: 'suite',          label: 'Suite' },
    { value: 'familiale',      label: 'Chambre Familiale' },
    { value: 'deluxe',         label: 'Chambre Deluxe' },
    { value: 'presidentielle', label: 'Suite Présidentielle' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.chambreForm = this.fb.group({
      number:   ['', [Validators.required, Validators.minLength(1)]],
      floor:    [null, [Validators.required, Validators.min(0)]],
      type:     ['', Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]],
      price:    [null, [Validators.required, Validators.min(1)]],
      staff:    [''],
      notes:    ['', Validators.maxLength(500)],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.chambreForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isFieldValid(field: string): boolean {
    const control = this.chambreForm.get(field);
    return !!(control && control.valid && (control.dirty || control.touched));
  }

  private generateId(): string {
    return 'room-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  onSubmit(): void {
    if (this.chambreForm.invalid) {
      this.chambreForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Simulate async save (replace with your service call)
    setTimeout(() => {
      const values = this.chambreForm.value;
      const nouvelleChambre: Chambre = {
        id:       this.generateId(),
        number:   values.number.trim(),
        floor:    Number(values.floor),
        type:     values.type as RoomType,
        capacity: Number(values.capacity),
        price:    Number(values.price),
        ...(values.staff?.trim()  ? { staff: values.staff.trim() }  : {}),
        ...(values.notes?.trim()  ? { notes: values.notes.trim() }  : {}),
      };

      this.chambreAjoutee.emit(nouvelleChambre);
      this.isLoading = false;
      this.chambreForm.reset();
    }, 800);
  }

  onCancel(): void {
    this.annuler.emit();
    this.chambreForm.reset();
  }
}