import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, ROLES } from '../../core/auth.service';
import { mensajeError } from '../../shared/mensaje-error';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  protected readonly roles = ROLES;
  protected cargando = signal(false);
  protected error = signal('');

  protected form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol_id: [2, Validators.required], // por defecto "usuario"
  });

  registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    this.auth.registrar(this.form.getRawValue()).subscribe({
      next: () => {
        // despues de crear la cuenta se manda al login para entrar
        this.snack.open('Cuenta creada, ahora inicia sesión', 'OK', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }
}
