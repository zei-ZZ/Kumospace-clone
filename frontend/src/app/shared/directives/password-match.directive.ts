import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const group = control as FormGroup;
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    return password &&
           confirmPassword &&
           password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  };
}
