import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Task } from '../task.model';
import { lettersRequiredValidator } from '../../agents/agents-table-validators';
import { AgentsService } from '../../agents/agents.service';
import { Agent } from '../../agents/agents.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;
  crewId!: number;
  agents: Agent[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService,
    private agentsService: AgentsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.crewId = +this.route.snapshot.paramMap.get('id')!;
    this.loadAgents();
    this.initializeForm();
  }

  loadAgents(): void {
    if (this.crewId) {
      this.agents = this.agentsService.getAgentsByCrewId(this.crewId);
    }
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
          lettersRequiredValidator(),
        ],
      ],
      expected_output: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
          lettersRequiredValidator(),
        ],
      ],
      agentId: ['', Validators.required],
    });
  }

  //SUBMIT FORM
  onSubmit(): void {
    if (this.taskForm.valid) {
      this.tasksService.addTask(
        this.crewId,
        +this.taskForm.value.agentId,
        this.taskForm.value.title,
        this.taskForm.value.description,
        this.taskForm.value.expected_output
      );

      this.navigateToTasks();
    } else {
      console.log('Form is invalid');
    }
  }

  private navigateToTasks(): void {
    this.router.navigate([`/crew/${this.crewId}/google-sheet/tasks`]);
  }
  closeModal(): void {
    this.location.back();
  }
}
