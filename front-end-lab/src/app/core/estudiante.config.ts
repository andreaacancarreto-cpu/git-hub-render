// ============================================================
// UN SOLO LUGAR para definir los campos de "estudiante".
// La tabla y el formulario se generan a partir de esta lista.
// Coincide con server/models/estudiante.js del back end
// y con la tabla estudiantes del script de DBeaver.
// (el id lo genera la base de datos)
// ============================================================
export interface Campo {
  nombre: string; // nombre exacto del campo en la API
  etiqueta: string; // texto que ve el usuario
  tipo: 'text' | 'email' | 'number';
  requerido: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
}

export const CAMPOS_ESTUDIANTE: Campo[] = [
  { nombre: 'carnet', etiqueta: 'Carnet', tipo: 'text', requerido: true, maxLength: 20 },
  { nombre: 'nombre', etiqueta: 'Nombre completo', tipo: 'text', requerido: true, maxLength: 150 },
  { nombre: 'carrera', etiqueta: 'Carrera', tipo: 'text', requerido: false, maxLength: 100 },
  // NUMERIC(4,2) en la base: de 0 a 99.99
  { nombre: 'promedio', etiqueta: 'Promedio', tipo: 'number', requerido: false, min: 0, max: 99.99 },
];

export interface Estudiante {
  id?: number;
  [campo: string]: unknown;
}
