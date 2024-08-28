import { Component, input, OnInit } from '@angular/core';
import { CrewService } from '../../../services/crew.service';
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
export class CreateCrewComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private crewService: CrewService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      process: ['sequential', Validators.required],
      llm: ['gpt-4', Validators.required],
    });
  }

  get name() {
    return this.form.get('name');
  }

  //SUBMIT FORM
  onSubmit() {
    if (this.form.valid && this.authService.currentUser) {
      const newCrew = this.crewService.createCrew(
        this.form.value.name,
        this.authService.currentUser.id,
        this.form.value.process,
        this.form.value.llm
      );
      console.log(newCrew);

      this.router.navigate([`/crew/${newCrew.id}/google-sheet/`]);
    }
  }

  goBack() {
    this.location.back();
  }
}
