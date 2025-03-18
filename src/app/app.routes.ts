import { Routes } from '@angular/router';
import { UserComponent } from './usuario/usuario.component';
import { GymComponent } from './gym/gym.component';
import { CombatComponent } from './combat/combat.component';

export const routes: Routes = [
  { path: 'users', component: UserComponent },
  { path: 'gyms', component: GymComponent },
  { path: 'combats', component: CombatComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' }, // Redirección por defecto
  { path: '**', redirectTo: '/users' } // Ruta para manejar errores 404
];