import { Routes } from '@angular/router';

import { Accueil } from './accueil/accueil';
import { Reservation } from './reservation/reservation';
import { Payement } from './payement/payement';
import { Administration } from './administration/administration';

import { Gestionclient } from './gestionclient/gestionclient';
import { Dashboard } from './dashboard/dashboard';
import { Addchambre } from './addchambre/addchambre';
import { Plainte } from './plainte/plainte';
import { Inscription } from './inscription/inscription';
import { ConnectionC } from './connection/connection';
import { AdminUser } from './admin-user/admin-user';
import { GestionChambres } from './gestion-chambres/gestion-chambres';
import { Fidelite } from './fidelite/fidelite';
import { RoleGuard } from './role-guard';



export const routes: Routes = [
  { path: '', redirectTo: '/connexion', pathMatch: 'full' },
  
  // Routes PUBLIQUES - Pas de guard
  { path: 'connexion', component: ConnectionC },
  { path: 'inscription', component: Inscription },
  
  // Routes PROTÉGÉES - Avec RoleGuard
  { 
    path: 'accueil', 
    component: Accueil,
    canActivate: [RoleGuard],
    data: { roles: ['CLIENT', 'PERSONNEL', 'RECEPTIONNISTE', 'ADMIN'] }
  },
  { 
    path: 'reservations', 
    component: Reservation,
    canActivate: [RoleGuard],
    data: { roles: ['CLIENT', 'RECEPTIONNISTE', 'ADMIN'] }
  },
  { 
    path: 'reservation', 
    component: Reservation,
    canActivate: [RoleGuard],
    data: { roles: ['CLIENT', 'RECEPTIONNISTE', 'ADMIN'] }
  },
  { 
    path: 'payement', 
    component: Payement,
    canActivate: [RoleGuard],
    data: { roles: ['RECEPTIONNISTE', 'ADMIN'] }
  },
  { 
    path: 'administration', 
    component: Administration,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'gestion-clients', 
    component: Gestionclient,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'RECEPTIONNISTE'] }
  },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'PERSONNEL','RECEPTIONNISTE'] }
  },
  { 
    path: 'addchambre', 
    component: Addchambre,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'plainteetdemande', 
    component: Plainte,
    canActivate: [RoleGuard],
    data: { roles: ['CLIENT', 'RECEPTIONNISTE'] }
  },
  { 
    path: 'adminUser', 
    component: AdminUser,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'gestion-chambres', 
    component: GestionChambres,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'fidelite', 
    component: Fidelite,
    canActivate: [RoleGuard],
    data: { roles: ['CLIENT'] }
  },
];


