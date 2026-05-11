import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Room } from '../models/chambre.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roomcard',
  imports: [CommonModule],
  templateUrl: './roomcard.html',
  styleUrl: './roomcard.css',
})
export class Roomcard {
 @Input({ required: true }) room!: Room;
  /** Mode consultation : la carte reste cliquable pour afficher les infos sans modifier. */
  @Input() readOnly = false;
  @Output() cardClick = new EventEmitter<Room>();
 
  get statusLabel(): string {
    const labels: Record<string, string> = {
      available: 'Disponible', occupied: 'Occupée',
      cleaning: 'Nettoyage', maintenance: 'Maintenance'
    };
    return labels[this.room.status];
  }
 
  onClick(): void { this.cardClick.emit(this.room); }


}





