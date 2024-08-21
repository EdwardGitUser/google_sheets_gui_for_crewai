import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgClass, NgIf, Location } from '@angular/common';
import { lettersOnlyValidator, lettersRequiredValidator } from './validators';
import { AgentsService } from '../agents.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-agent',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.css'],
})
export class CreateAgentComponent implements OnInit {
  agentForm!: FormGroup;
  crewId!: number;

  //я отримую стрінгу а треба намбер для всіх айді, можу переписати в стрінгу всі айді якщо треба
  // crewId = input.required();

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private agentsService: AgentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.crewId = +params['crewId']; // Retrieve crewId from query params
    });

    this.agentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      role: [
        '',
        [Validators.required, Validators.minLength(3), lettersOnlyValidator()],
      ],
      goal: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          lettersRequiredValidator(),
        ],
      ],
      backstory: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          lettersRequiredValidator(),
        ],
      ],
      verbose: [false],
      tool: ['some_tool1', Validators.required],
    });
  }

  get name() {
    return this.agentForm.get('name');
  }

  get role() {
    return this.agentForm.get('role');
  }

  get goal() {
    return this.agentForm.get('goal');
  }

  get backstory() {
    return this.agentForm.get('backstory');
  }

  get verbose() {
    return this.agentForm.get('verbose');
  }

  get tool() {
    return this.agentForm.get('tool');
  }

  onSubmit(): void {
    if (this.agentForm.valid) {
      const newAgent = this.agentsService.addAgent({
        id: Math.floor(Math.random() * 1000000),
        crewId: this.crewId,
        name: this.agentForm.value.name,
        role: this.agentForm.value.role,
        goal: this.agentForm.value.goal,
        backstory: this.agentForm.value.backstory,
        verbose: this.agentForm.value.verbose,
        tool: this.agentForm.value.tool,
      });

      console.log('Agent created:', newAgent);

      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
