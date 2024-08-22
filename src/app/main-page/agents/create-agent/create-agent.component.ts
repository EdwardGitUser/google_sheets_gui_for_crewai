import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NgClass, Location } from '@angular/common';
import { lettersOnlyValidator, lettersRequiredValidator } from '../validators';
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
    //анугляр сам відписується тут
    this.route.params.subscribe((params) => {
      this.crewId = +params['id'];
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

      this.navigateToAgents();
    }
  }

  navigateToAgents(): void {
    this.router.navigate([`/crew/${this.crewId}/agents`]);
  }

  goBack(): void {
    this.location.back();
  }
}
