import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  loginFailed = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  get usernameIsInvalid() {
    return (
      this.form.controls.username.touched &&
      this.form.controls.username.dirty &&
      this.form.controls.username.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const username = this.form.get('username')!.value!;
      const password = this.form.get('password')!.value!;

      const loginSuccess = this.authService.login(username, password);

      if (loginSuccess) {
        console.log('Login successful');
        this.loginFailed.set(false);

        this.router.navigate(['/']);
      } else {
        console.log('Login failed');
        this.loginFailed.set(true);
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
