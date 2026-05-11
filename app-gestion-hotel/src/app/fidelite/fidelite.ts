import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fidelite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fidelite.html',
  styleUrl: './fidelite.css'
})
export class Fidelite implements OnInit {
  
  // Points de fidélité (à remplacer par un service réel)
  loyaltyPoints = 4250;
  loyaltyTier = 'Or';
  nextTierPoints = 5000;
  progressPercentage = (this.loyaltyPoints / this.nextTierPoints) * 100;

  loyaltyBenefits = [
    { icon: '🎁', title: 'Points de récompense', description: '1 point pour chaque euro dépensé' },
    { icon: '⭐', title: 'Statut VIP', description: 'Accès prioritaire aux réservations' },
    { icon: '💎', title: 'Réductions exclusives', description: '10% de réduction sur votre prochain séjour' },
    { icon: '🎉', title: 'Offres spéciales', description: 'Avantages personnalisés selon votre profil' }
  ];

  recentRewards = [
    { date: '15 Mai 2024', description: 'Séjour à l\'hôtel', points: 150 },
    { date: '10 Mai 2024', description: 'Bonus bienvenue', points: 100 },
    { date: '05 Mai 2024', description: 'Petit déjeuner', points: 30 }
  ];

  ngOnInit(): void {
    // Charger les données de fidélité depuis un service
  }

  redeemPoints(points: number): void {
    alert(`Vous avez utilisé ${points} points!`);
  }
}
