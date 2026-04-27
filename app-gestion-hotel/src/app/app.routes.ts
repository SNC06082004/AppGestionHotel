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



export const routes: Routes = [
  { path: '', redirectTo: '/connexion', pathMatch: 'full' },
  { path: 'connexion', component: ConnectionC  },
  { path: 'inscription', component: Inscription },
  { path: 'accueil', component: Accueil },
  { path: 'reservations', component: Reservation},
  { path: 'payement', component: Payement },
  { path: 'administration', component: Administration },
  { path: 'gestion-clients', component: Gestionclient },
  { path: 'dashboard', component: Dashboard },
  { path: 'addchambre', component: Addchambre },
  { path: 'plainteetdemande', component: Plainte }
];


