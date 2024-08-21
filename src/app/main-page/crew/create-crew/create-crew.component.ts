import { Component, input } from '@angular/core';
import { CrewService } from '../crew.service';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-create-crew',
  standalone: true,
  imports: [FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './create-crew.component.html',
  styleUrls: ['./create-crew.component.css'],
})
export class CreateCrewComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private crewService: CrewService,
    private router: Router,
    private location: Location
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      process: ['sequential', Validators.required],
    });
  }

  get name() {
    return this.form.get('name');
  }

  onSubmit() {
    if (this.form.valid && this.authService.currentUser) {
      this.crewService.createCrew(
        this.form.value.name,
        this.authService.currentUser.id,
        this.form.value.process
      );
      this.router.navigate(['/']);
    }
  }

  goBack() {
    this.location.back(); 
  }
}
