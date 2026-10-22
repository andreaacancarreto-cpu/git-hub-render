import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Se ejecuta en CADA petición HTTP: agrega el token JWT si existe.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();

  // Login y registro no necesitan token
  // (includes y no startsWith porque en render la url empieza con https://...)
  if (req.url.includes('/api/auth')) return next(req);

  const peticion = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(peticion).pipe(
    catchError(error => {
      // Token ausente, vencido o inválido: se cierra la sesión y se vuelve al login.
      // (El servidor responde 401 sin token y 403 "Token inválido o expirado".)
      const esProblemaDeToken =
        error.status === 401 || (error.status === 403 && /token/i.test(error.error?.message ?? ''));
      if (token && esProblemaDeToken) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
