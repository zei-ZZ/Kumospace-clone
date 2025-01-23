import { Component } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isSignUp = false;
  signInForm: FormGroup;
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    const signUpOptions: AbstractControlOptions = {
      validators: this.passwordMatchValidator(),
    };

    this.signUpForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      signUpOptions
    );
  }

  toggleForm() {
    this.isSignUp = !this.isSignUp;
  }

  passwordMatchValidator(): ValidatorFn {
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

  onSignIn() {
    if (this.signInForm.valid) {
      console.log(this.signInForm.value);
    }
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
    }
  }
}
