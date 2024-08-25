import { Component, input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TasksService } from '../tasks.service';
import { Task } from '../task.model';
import { lettersRequiredValidator } from '../../agents/agents-table-validators';

import { Agent } from '../../agents/agents.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
  crewId = input.required<string>();
  agents = input.required<Agent[]>();
  onTaskCreate = output<Task>();
  onCloseModal = output();

  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,

    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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
      const newTask: Task = this.tasksService.onCreateTask(
        this.crewId(),
        this.taskForm.value.agentId,
        this.taskForm.value.title,
        this.taskForm.value.description,
        this.taskForm.value.expected_output
      );
      this.onTaskCreate.emit(newTask);
    } else {
      console.log('Form is invalid');
    }
  }

  closeModal() {
    this.onCloseModal.emit();
  }
}
