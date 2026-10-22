//pedirle a Angular la herramienta para hacer peticiones.
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//librería para trabajar con flujos de datos que llegan con el tiempo
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

const CLAVE_TOKEN = 'token';
// en local va vacio (proxy), en render es la url del back
const API = environment.apiUrl;

// Coincide con los roles insertados en server/schema.sql
export const ROLES: { id: number; nombre: string }[] = [
  { id: 1, nombre: 'admin' },
  { id: 2, nombre: 'usuario' },
];

// El token JWT lleva { id, rol_id, iat, exp }. Se lee sin librerías:
// la parte central (payload) es JSON codificado en base64.
function leerPayload(token: string | null): { id: number; rol_id: number; exp: number } | null {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function tokenGuardadoVigente(): string | null {
  const token = localStorage.getItem(CLAVE_TOKEN);
  const payload = leerPayload(token);
  if (!payload || payload.exp * 1000 < Date.now()) {
    localStorage.removeItem(CLAVE_TOKEN);
    return null;
  }
  return token;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // El token vive en una señal (la pantalla reacciona) y en localStorage (sobrevive al recargar).
  readonly token = signal<string | null>(tokenGuardadoVigente());
  readonly autenticado = computed(() => !!this.token());
  readonly rolId = computed(() => leerPayload(this.token())?.rol_id ?? null);
  readonly rolNombre = computed(() => ROLES.find(r => r.id === this.rolId())?.nombre ?? '');
  readonly esAdmin = computed(() => this.rolNombre() === 'admin');

  login(email: string, password: string) {
    return this.http
      .post<{ message: string; token: string }>(`${API}/api/auth/login`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem(CLAVE_TOKEN, res.token);
          this.token.set(res.token);
        }),
      );
  }

  registrar(datos: { nombre: string; email: string; password: string; rol_id: number }) {
    return this.http.post<{ message: string; id: number }>(`${API}/api/auth/registrar`, datos);
  }

  probarToken() {
    return this.http.get(`${API}/api/ejemplo`);
  }

  logout() {
    localStorage.removeItem(CLAVE_TOKEN);
    this.token.set(null);
  }
}
