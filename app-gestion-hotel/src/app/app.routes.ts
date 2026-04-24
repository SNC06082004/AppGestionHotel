import { Routes } from '@angular/router';
import { Inscription } from './inscription/inscription';
import { Connection } from './connection/connection';
import { Accueil } from './accueil/accueil';
import { Reservation } from './reservation/reservation';
import { Payement } from './payement/payement';
import { Administration } from './administration/administration';

import { Gestionclient } from './gestionclient/gestionclient';
import { Dashboard } from './dashboard/dashboard';
import { Addchambre } from './addchambre/addchambre';


export const routes: Routes = [
  { path: '', redirectTo: '/connexion', pathMatch: 'full' },
  { path: 'connexion', component: Connection  },
  { path: 'inscription', component: Inscription },
  { path: 'accueil', component: Accueil },
  { path: 'reservations', component: Reservation},
  { path: 'payement', component: Payement },
  { path: 'administration', component: Administration },
  { path: 'gestion-clients', component: Gestionclient },
  { path: 'dashboard', component: Dashboard },
  { path: 'addchambre', component: Addchambre }
];


