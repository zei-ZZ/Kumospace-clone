import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserCredentials } from '../shared/models/user';
import { AuthService } from '../shared/services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { StorageService } from '../shared/services/storage.service';
import { STORAGE_KEYS } from '../shared/constants/storage-keys';
import { passwordMatchValidator } from '../shared/directives/password-match.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  isSignUp = false;
  user = new User();
  credentials = new UserCredentials();

  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  signUpForm = this.fb.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator() }
  );

  toggleForm() {
    this.isSignUp = !this.isSignUp;
  }

  onSignIn() {
    if (this.signInForm.valid) {
      console.log(this.signInForm.value);
      const { email, password } = this.signInForm.value;
      this.credentials = { email: email!, password: password! };
      this.authService.login(this.credentials).subscribe({
        next: (response) => {
          console.log(response);
          this.storageService.setItem(
            STORAGE_KEYS.ACCESS_TOKEN,
            response.user.token
          );
          this.authService.isAuthenticated.set(response.user);
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have been logged in successfully!',
          });
          this.router.navigate([`/userpage/${response.user.id}`]);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.error.message || 'An error occurred during login.',
          });
        },
      });
    }
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      const { username, email, password } = this.signUpForm.value;
      this.user = { username: username!, email: email!, password: password! };
      console.log(this.user);
      this.authService.register(this.user).subscribe({
        next: (response) => {
          console.log(response);
          this.storageService.setItem(
            STORAGE_KEYS.ACCESS_TOKEN,
            response.user.token
          );
          this.authService.isAuthenticated.set(response.user);
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have been registered successfully!',
          });
          this.router.navigate([`/userpage/${response.user.id}`]);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'An error occurred during registration.',
          });
        },
      });
    }
  }
}
