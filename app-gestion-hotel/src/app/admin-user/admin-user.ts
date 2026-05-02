import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { UpdateUserRequestDTO } from '../models/user.model';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './admin-user.html',
  styleUrls: ['./admin-user.css'],
  providers: [AdminService]
})
export class AdminUser implements OnInit, OnDestroy {
  userForm!: FormGroup;
  
  currentUser: any = null;
  userTypes: Array<'CLIENT' | 'PERSONNEL' | 'RECEPTIONNISTE' | 'ADMIN'> = ['CLIENT', 'PERSONNEL', 'RECEPTIONNISTE', 'ADMIN'];
  activeTab: 'CLIENT' | 'PERSONNEL' | 'RECEPTIONNISTE' | 'ADMIN' = 'CLIENT';
  
  users: any[] = [];
  filteredUsers: any[] = [];
  
  isSubmitting = false;
  isEditing = false;
  editingUserId: number | null = null;
  
  errorMessage = '';
  successMessage = '';
  
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est admin
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        
        if (!user) {
          console.warn('⚠️ Utilisateur non connecté. Redirection...');
          this.router.navigate(['/connexion']);
          return;
        }
        
        console.log('✅ Utilisateur connecté:', user);
        this.loadUsers();
      });

    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s]{8,15}$/)]],
      userType: ['CLIENT', Validators.required]
    });
  }

  get f() {
    return this.userForm.controls;
  }

  isInvalid(champ: string): boolean {
    const control = this.f[champ];
    return control?.invalid && (control?.dirty || control?.touched);
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        console.log('✅ Utilisateurs chargés:', users);
        this.users = users;
        this.filterUsersByTab();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement:', err);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
      }
    });
  }

  filterUsersByTab(): void {
    this.filteredUsers = this.users.filter(u => {
      // Chercher le userType dans l'objet
      const type = u.userType || this.activeTab;
      return type === this.activeTab;
    });
    this.currentPage = 1;
    console.log(`📊 ${this.filteredUsers.length} ${this.activeTab} trouvés`);
  }

  switchTab(tab: 'CLIENT' | 'PERSONNEL' | 'RECEPTIONNISTE' | 'ADMIN'): void {
    this.activeTab = tab;
    this.filterUsersByTab();
    this.resetForm();
    this.errorMessage = '';
    this.successMessage = '';
  }

  // ✅ Helper pour compter les utilisateurs par type
  getUserCountByType(type: 'CLIENT' | 'PERSONNEL' | 'RECEPTIONNISTE' | 'ADMIN'): number {
    return this.users.filter(u => (u.userType || 'CLIENT') === type).length;
  }

  onSubmit(): void {
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const formData = this.userForm.value;
    const userType = formData.userType;

    if (this.isEditing && this.editingUserId) {
      // Modification
      const updateData: UpdateUserRequestDTO = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone
      };

      this.adminService.updateUser(this.editingUserId, updateData).subscribe({
        next: (response) => {
          console.log('✅ Utilisateur modifié:', response);
          this.successMessage = 'Utilisateur modifié avec succès!';
          this.loadUsers();
          this.resetForm();
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Erreur:', err);
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.isSubmitting = false;
        }
      });
    } else {
      // Création
      const createData: UpdateUserRequestDTO = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone
      };

      // Si c'est un ADMIN, utiliser l'endpoint spécifique
      const request = userType === 'ADMIN' 
        ? this.adminService.createAdmin(createData)
        : this.adminService.createUser(createData, userType);

      request.subscribe({
        next: (response) => {
          console.log('✅ Utilisateur créé:', response);
          this.successMessage = 'Utilisateur créé avec succès!';
          this.loadUsers();
          this.resetForm();
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Erreur:', err);
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
          this.isSubmitting = false;
        }
      });
    }
  }

  editUser(user: any): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    
    this.userForm.patchValue({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      userType: user.userType || this.activeTab
    });

    // Désactiver le champ userType en modification
    this.userForm.get('userType')?.disable();

    // Scroll vers le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteUser(id: number, name: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          console.log('✅ Utilisateur supprimé');
          this.successMessage = 'Utilisateur supprimé avec succès!';
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('❌ Erreur:', err);
          this.errorMessage = 'Erreur lors de la suppression';
        }
      });
    }
  }

  resetForm(): void {
    this.userForm.reset();
    this.userForm.get('userType')?.setValue(this.activeTab);
    
    if (this.isEditing) {
      this.userForm.get('userType')?.enable();
      this.isEditing = false;
      this.editingUserId = null;
    }
  }

  get paginatedUsers(): any[] {
    const filtered = this.filteredUsers.filter(u =>
      u.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    const filtered = this.filteredUsers.filter(u =>
      u.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return Math.ceil(filtered.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Fonction helper pour obtenir le badge
  getUserTypeBadge(userType: string | undefined): string {
    return userType ? `badge-${userType.toLowerCase()}` : 'badge-client';
  }
}