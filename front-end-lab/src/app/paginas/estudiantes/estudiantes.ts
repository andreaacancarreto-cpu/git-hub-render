import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudiantesService } from '../../core/estudiantes.service';
import { CAMPOS_ESTUDIANTE, Campo, Estudiante } from '../../core/estudiante.config';
import { mensajeError } from '../../shared/mensaje-error';

// arma los validadores de cada campo segun lo que dice estudiante.config.ts
function validadoresDe(campo: Campo): ValidatorFn[] {
  const v: ValidatorFn[] = [];
  if (campo.requerido) v.push(Validators.required);
  if (campo.maxLength) v.push(Validators.maxLength(campo.maxLength));
  if (campo.min !== undefined) v.push(Validators.min(campo.min));
  if (campo.max !== undefined) v.push(Validators.max(campo.max));
  return v;
}

@Component({
  selector: 'app-estudiantes',
  imports: [
    ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatTableModule, MatTooltipModule, MatProgressBarModule,
  ],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.scss',
})
export class Estudiantes implements OnInit {
  private servicio = inject(EstudiantesService);
  private snack = inject(MatSnackBar);

  protected readonly campos = CAMPOS_ESTUDIANTE;
  // columnas de la tabla: id + los campos + los botones
  protected readonly columnas = ['id', ...CAMPOS_ESTUDIANTE.map(c => c.nombre), 'acciones'];

  protected estudiantes = signal<Estudiante[]>([]);
  protected cargando = signal(false);
  protected guardando = signal(false);
  protected editandoId = signal<number | null>(null);

  // un FormControl por cada campo de la lista
  protected form = new FormGroup(
    Object.fromEntries(
      CAMPOS_ESTUDIANTE.map(c => [c.nombre, new FormControl<string | number | null>(null, validadoresDe(c))]),
    ),
  );

  // se necesita para limpiar tambien el "ya se envio" del form (si no salen los errores en rojo)
  private formDir = viewChild(FormGroupDirective);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.servicio.listar().subscribe({
      next: datos => {
        this.estudiantes.set(datos);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.avisar(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // los campos vacios se mandan como null (promedio vacio queda en 0 por el default)
    const datos: Estudiante = {};
    for (const campo of this.campos) {
      const valor = this.form.controls[campo.nombre].value;
      datos[campo.nombre] = valor === '' || valor === null ? null : valor;
    }
    if (datos['promedio'] === null) datos['promedio'] = 0;

    const id = this.editandoId();
    const peticion = id ? this.servicio.editar(id, datos) : this.servicio.crear(datos);

    this.guardando.set(true);
    peticion.subscribe({
      next: () => {
        this.avisar(id ? 'Estudiante actualizado' : 'Estudiante guardado');
        this.cancelar();
        this.cargar();
        this.guardando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.avisar(mensajeError(err));
        this.guardando.set(false);
      },
    });
  }

  // llena el formulario con los datos del estudiante para editarlo
  editar(estudiante: Estudiante) {
    this.editandoId.set(estudiante.id ?? null);
    for (const campo of this.campos) {
      const valor = estudiante[campo.nombre];
      // promedio viene como texto ("85.50") porque es NUMERIC en postgres
      this.form.controls[campo.nombre].setValue(
        campo.tipo === 'number' && valor !== null ? Number(valor) : (valor as string | null),
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(estudiante: Estudiante) {
    if (!confirm(`¿Eliminar a ${estudiante['nombre']}?`)) return;

    this.servicio.eliminar(estudiante.id!).subscribe({
      next: () => {
        this.avisar('Estudiante eliminado');
        if (this.editandoId() === estudiante.id) this.cancelar();
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.avisar(mensajeError(err)),
    });
  }

  cancelar() {
    this.editandoId.set(null);
    const dir = this.formDir();
    if (dir) dir.resetForm();
    else this.form.reset();
  }

  // para mostrar el valor de una celda (el promedio siempre con 2 decimales)
  valorCelda(estudiante: Estudiante, campo: Campo): string {
    const valor = estudiante[campo.nombre];
    if (valor === null || valor === undefined) return '';
    return campo.tipo === 'number' ? Number(valor).toFixed(2) : String(valor);
  }

  private avisar(texto: string) {
    this.snack.open(texto, 'OK', { duration: 3000 });
  }
}
