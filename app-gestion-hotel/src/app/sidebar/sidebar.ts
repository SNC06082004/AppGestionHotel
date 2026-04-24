import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ChambreService } from '../services/chambre.service';
import { RoomStatus } from '../models/chambre.model'; 
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() activeFilter: RoomStatus | 'all' = 'all';
  @Output() filterChange = new EventEmitter<RoomStatus | 'all'>();
 
  roomService = inject(ChambreService);
}
