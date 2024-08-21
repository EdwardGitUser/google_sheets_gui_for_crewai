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
import { lettersRequiredValidator } from '../../agents/validators';
import { AgentsService } from '../../agents/agents.service';
import { Agent } from '../../agents/agents.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
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
    private agentsService: AgentsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.crewId = +params['id'];
      this.loadAgents();
    });

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

  loadAgents(): void {
    if (this.crewId) {
      this.agents = this.agentsService.getAgentsByCrewId(this.crewId);
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: Math.floor(Math.random() * 10000),
        crewId: this.crewId,
        agentId: +this.taskForm.value.agentId,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        expected_output: this.taskForm.value.expected_output,
      };

      this.tasksService.addTask(newTask);
      this.router.navigate([`/crew/${this.crewId}/tasks`]);
    }
  }

  closeModal(): void {
    this.router.navigate([`/crew/${this.crewId}/tasks`]);
  }
}
