import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador personalizado para RUT chileno
 */
export function rutValidator(control: AbstractControl): ValidationErrors | null {
  const rut = control.value;
  if (!rut) return null;

  // Expresión regular para el formato de RUT sin puntos y con guion
  const rutRegex = /^\d{7,8}-[0-9Kk]$/;
  if (!rutRegex.test(rut)) {
    return { invalidRutFormat: true };
  }

  // Validación del dígito verificador
  const [rutNumber, dv] = rut.split('-');
  const calculatedDV = calculateDV(parseInt(rutNumber, 10));
  if (calculatedDV !== dv.toUpperCase()) {
    return { invalidRutDV: true };
  }

  return null;
}

/**
 * Calcula el dígito verificador del RUT chileno
 */
export function calculateDV(rut: number): string {
  let sum = 0;
  let multiplier = 2;

  while (rut > 0) {
    sum += (rut % 10) * multiplier;
    rut = Math.floor(rut / 10);
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  if (remainder === 11) return '0';
  if (remainder === 10) return 'K';
  return remainder.toString();
}
