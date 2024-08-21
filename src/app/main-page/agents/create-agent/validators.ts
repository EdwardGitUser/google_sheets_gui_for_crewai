// validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function lettersOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[a-zA-Z]+$/.test(control.value);
    return valid ? null : { lettersOnly: true };
  };
}

export function lettersRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /[a-zA-Z]/.test(control.value);
    return valid ? null : { lettersRequired: true };
  };
}
