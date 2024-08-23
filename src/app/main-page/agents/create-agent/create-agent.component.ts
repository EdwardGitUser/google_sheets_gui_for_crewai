import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NgClass, Location } from '@angular/common';
import {
  lettersOnlyValidator,
  lettersRequiredValidator,
} from '../agents-table-validators';
import { AgentsService } from '../agents.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-agent',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, FormsModule],
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
    this.crewId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
  }

  private initializeForm(): void {
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
    if (this.agentForm.valid && this.crewId !== null) {
      const newAgent = this.agentsService.createAgent(
        this.agentForm.value.name,
        this.crewId,
        this.agentForm.value.role,
        this.agentForm.value.goal,
        this.agentForm.value.backstory,
        this.agentForm.value.verbose,
        this.agentForm.value.tool
      );

      console.log('Agent created:', newAgent);

      this.navigateToAgents();
    }
  }

  navigateToAgents(): void {
    this.router.navigate([`/crew/${this.crewId}/google-sheet/agents`]);
  }

  goBack(): void {
    this.location.back();
  }
}
