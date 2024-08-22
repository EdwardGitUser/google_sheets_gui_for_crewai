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
  form!: FormGroup;
  loginFailed = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  get usernameIsInvalid() {
    const usernameControl = this.form.get('username');
    return (
      usernameControl?.touched &&
      usernameControl?.dirty &&
      usernameControl?.invalid
    );
  }

  get passwordIsInvalid() {
    const passwordControl = this.form.get('passwords.password');
    return (
      passwordControl?.touched &&
      passwordControl?.dirty &&
      passwordControl?.invalid
    );
  }

  //Form Submit
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
