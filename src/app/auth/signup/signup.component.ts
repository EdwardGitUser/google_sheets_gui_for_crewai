import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      {
        validators: [this.passwordMatchValidator],
      }
    ),
  });

  usernameTaken = signal(false); //for checking

  constructor(private authService: AuthService, private router: Router) {}

  //validator
  passwordMatchValidator(control: AbstractControl) {
    let password = control.get('password')?.value;
    let confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get usernameIsInvalid() {
    return (
      this.form.get('username')?.touched &&
      this.form.get('username')?.dirty &&
      this.form.get('username')?.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.get('passwords.password')?.touched &&
      this.form.get('passwords.password')?.dirty &&
      this.form.get('passwords.password')?.invalid
    );
  }

  get confirmPasswordIsInvalid() {
    return (
      this.form.get('passwords.confirmPassword')?.touched &&
      this.form.get('passwords.confirmPassword')?.dirty &&
      this.form.get('passwords.confirmPassword')?.invalid
    );
  }

  get passwordsMismatch() {
    const passwordsGroup = this.form.get('passwords');
    const password = passwordsGroup?.get('password');
    const confirmPassword = passwordsGroup?.get('confirmPassword');
    return (
      passwordsGroup?.hasError('mismatch') &&
      password?.dirty &&
      confirmPassword?.dirty &&
      password?.touched &&
      confirmPassword?.touched
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const username = this.form.get('username')!.value!;
      const password = this.form.get('passwords.password')!.value!;

      const newUser = this.authService.signUp(username, password);

      if (newUser) {
        console.log('New user created:', newUser);
        this.usernameTaken.set(false);
        this.router.navigate(['/']);
      } else {
        console.log('Username is already taken');
        this.usernameTaken.set(true);
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
