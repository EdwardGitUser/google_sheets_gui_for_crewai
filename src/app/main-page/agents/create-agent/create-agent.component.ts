import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NgClass, NgIf, Location } from '@angular/common';
import { lettersOnlyValidator, lettersRequiredValidator } from '../validators';
import { AgentsService } from '../agents.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-agent',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, FormsModule],
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.css'],
})
export class CreateAgentComponent implements OnInit {
  agentForm!: FormGroup;
  crewId!: number;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private agentsService: AgentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.crewId = +params['id']; // Retrieve crewId from params
    });

    this.agentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      role: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          lettersOnlyValidator(),
        ],
      ],
      goal: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
          lettersRequiredValidator(),
        ],
      ],
      backstory: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
          lettersRequiredValidator(),
        ],
      ],
      verbose: [false],
      tool: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.agentForm.valid) {
      console.log('Tool selected:', this.agentForm.value.tool);
      console.log('this.crewId,', this.crewId);
      console.log('this.crewId,', this.agentForm.value.name);
      console.log('this.crewId,', this.agentForm.value.name);
      console.log('this.crewId,', this.agentForm.value.backstory);
      console.log('this.crewId,', this.agentForm.value.verbose);

      const newAgent = this.agentsService.addAgent({
        id: Math.floor(Math.random() * 1000000),
        crewId: this.crewId,
        name: this.agentForm.value.name,
        role: this.agentForm.value.role,
        goal: this.agentForm.value.name,
        backstory: this.agentForm.value.backstory,
        verbose: this.agentForm.value.verbose,
        tool: this.agentForm.value.tool,
      });

      console.log('Agent created:', newAgent);

      this.navigateToAgents(); // Navigate to the agents list after creation
    }
  }

  navigateToAgents(): void {
    this.router.navigate([`/crew/${this.crewId}/agents`]);
  }

  goBack(): void {
    this.location.back();
  }
}
