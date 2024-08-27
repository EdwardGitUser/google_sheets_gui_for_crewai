import { Component, OnInit, signal } from '@angular/core';
import { Task } from '../../../shared/models/task.model';
import { NgClass } from '@angular/common';
import { TasksService } from '../../../services/tasks.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentsService } from '../../../services/agents.service';
import { Agent } from '../../../shared/models/agents.model';
import { isAgentValid } from '../../../shared/validators/task-table-validators'; // Import the validator
import { AddTaskComponent } from '../../create-forms/add-task/add-task.component';
@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [NgClass, FormsModule, RouterModule, AddTaskComponent],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  crewId = signal<string | null>(null);
  showModal = signal<boolean>(false);
  initialTasks: Task[] = [];

  tableTasks: Task[] = [];
  agents: Agent[] = [];

  validationErrors: string[] = [];

  constructor(
    private tasksService: TasksService,
    private agentsService: AgentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.crewId.set(params['id']);
      this.loadTasks();
      this.loadAgents();
    });
  }

  //GET
  loadTasks() {
    if (this.crewId() !== null) {
      this.initialTasks = this.tasksService.getTasksByCrewId(this.crewId()!);
      this.tableTasks = JSON.parse(JSON.stringify(this.initialTasks));
    }
  }

  loadAgents() {
    if (this.crewId !== null) {
      this.agents = this.agentsService.getAgentsByCrewId(this.crewId()!);
    }
  }

  reloadTasks() {
    this.tableTasks = JSON.parse(JSON.stringify(this.initialTasks));
    console.log('Tasks reloaded to original state:', this.tableTasks);
  }

  //VALIDATORS
  validateTasks(): boolean {
    this.validationErrors = [];
    let isValid = true;

    const fieldsToValidate = [
      { name: 'Title', key: 'title' },
      { name: 'Description', key: 'description' },
      { name: 'Expected Output', key: 'expected_output' },
    ];

    this.tableTasks.forEach((task, rowIndex) => {
      fieldsToValidate.forEach((field) => {
        const value = task[field.key as keyof Task];
        if (!value || (value as string).length < 3) {
          this.validationErrors.push(
            `Error in row ${rowIndex + 1}, column ${field.name}: ${
              field.name
            } is required and must be at least 3 characters long.`
          );
          isValid = false;
        }
      });

      if (!isAgentValid(task.agentId, this.agents)) {
        this.validationErrors.push(
          `Error in row ${
            rowIndex + 1
          }, column Assigned Agent: Task must be assigned to an existing agent.`
        );
        isValid = false;
      }
    });

    return isValid;
  }

  //SAVE
  saveTasks() {
    if (this.validateTasks()) {
      const confirmSave = window.confirm('Do you want to save the changes?');
      if (confirmSave) {
        this.initialTasks = JSON.parse(JSON.stringify(this.tableTasks));

        this.tasksService.updateTasksByCrewId(this.crewId()!, this.tableTasks);
        console.log('Tasks saved:', this.initialTasks);
      }
    } else {
      console.log('Validation Errors:', this.validationErrors);
    }
  }

  //DELETE
  deleteTask(taskId: string) {
    if (
      window.confirm(
        'Are you sure you want to delete this task? This action cannot be undone.'
      )
    ) {
      this.tasksService.deleteTaskById(taskId);

      this.loadTasks();

      console.log('Temp tasks after deletion:', this.tableTasks);
    }
  }

  openAddTaskModal(): void {
    this.showModal.set(true);
  }

  closeAddTaskModal(): void {
    this.showModal.set(false);
  }
  onTaskCreated(): void {
    this.loadTasks();
    this.closeAddTaskModal();
  }
}
