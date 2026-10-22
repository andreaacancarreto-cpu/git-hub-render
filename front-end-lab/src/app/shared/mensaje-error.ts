import { HttpErrorResponse } from '@angular/common/http';

// saca un mensaje entendible de los errores que manda el back-end
export function mensajeError(err: HttpErrorResponse): string {
  // status 0 = no hubo respuesta (back apagado o render dormido)
  if (err.status === 0) {
    return 'No se pudo conectar con el servidor. Si está en Render, espera unos segundos e intenta de nuevo.';
  }

  const detalle: string = err.error?.error ?? err.error?.message ?? '';

  // errores de llave unica de postgres (carnet o email repetido)
  if (/unicidad|unique/i.test(detalle)) {
    if (/carnet/i.test(detalle)) return 'Ese carnet ya está registrado';
    if (/email/i.test(detalle)) return 'Ese correo ya está registrado';
    return 'Ese dato ya está registrado';
  }

  // sequelize manda "Validation error: ..." con el mensaje del modelo
  return detalle.replace(/^Validation error:\s*/i, '') || 'Ocurrió un error, intenta de nuevo';
}
