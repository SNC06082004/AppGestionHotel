import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-connection',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './connection.html',
  styleUrl: './connection.css',
})
export class Connection {
identifiant: string = '';
  motDePasse: string = '';

  onSubmit(): void {
    console.log('Connexion avec :', this.identifiant);
    // TODO: appeler ton service d'authentification ici
  }


  
}
