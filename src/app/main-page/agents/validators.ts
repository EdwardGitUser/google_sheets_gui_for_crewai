// validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function lettersOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[a-zA-Z]+$/.test(control.value);
    return valid ? null : { lettersOnly: true };
  };
}

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[0-9]+$/.test(control.value);
    return valid ? null : { numeric: true };
  };
}
export function lettersRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /[a-zA-Z]/.test(control.value);
    return valid ? null : { lettersRequired: true };
  };
}
export function minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = control.value.length >= minLength;
    return valid ? null : { minLength: { requiredLength: minLength } };
  };
}

export function requiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = control.value !== null && control.value.trim() !== '';
    return valid ? null : { required: true };
  };
}
export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = control.value.length <= maxLength;
    return valid ? null : { maxLength: { requiredLength: maxLength } };
  };
}
export function patternValidator(
  pattern: RegExp,
  errorName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = pattern.test(control.value);
    return valid ? null : { [errorName]: true };
  };
}
