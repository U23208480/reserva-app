import { Routes } from '@angular/router';
import { Reserva } from './reserva/reserva';

export const routes: Routes = [
  { path: 'reserva', component: Reserva },
  { path: '', redirectTo: 'reserva', pathMatch: 'full' },
  { path: '**', redirectTo: 'reserva' },
];
