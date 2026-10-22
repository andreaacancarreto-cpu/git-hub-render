import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

// login y registro son libres, estudiantes pide haber iniciado sesion
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./paginas/login/login').then(m => m.Login) },
  { path: 'registro', loadComponent: () => import('./paginas/registro/registro').then(m => m.Registro) },
  {
    path: 'estudiantes',
    canActivate: [authGuard],
    loadComponent: () => import('./paginas/estudiantes/estudiantes').then(m => m.Estudiantes),
  },
  { path: '', pathMatch: 'full', redirectTo: 'estudiantes' },
  { path: '**', redirectTo: 'estudiantes' },
];
