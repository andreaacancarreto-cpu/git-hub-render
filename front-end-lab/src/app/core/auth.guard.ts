import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Protege rutas: si no hay sesión, redirige al login.
export const authGuard: CanActivateFn = () =>
  inject(AuthService).autenticado() ? true : inject(Router).createUrlTree(['/login']);
