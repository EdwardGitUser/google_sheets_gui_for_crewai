import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { NgClass, NgFor } from '@angular/common';
import { TasksService } from '../tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentsService } from '../../agents/agents.service';
import { Agent } from '../../agents/agents.model';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [NgClass, NgFor, FormsModule],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  tasks: Task[] = [];

  tempTasks: Task[] = []; //COPY FOR TABLE SO NGMODEL DOESNT EFFECT THE ORIGINAL

  agents: Agent[] = [];
  crewId: number | null = null;

  validationErrors: string[] = [];

  constructor(
    private tasksService: TasksService,
    private agentsService: AgentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crewId = +this.route.snapshot.paramMap.get('id')!;
    this.loadTasks();
    this.loadAgents();
  }

  //GET
  loadTasks() {
    if (this.crewId !== null) {
      this.tasks = this.tasksService.getTasksByCrewId(this.crewId);
      this.tempTasks = JSON.parse(JSON.stringify(this.tasks));
    }
  }

  loadAgents() {
    if (this.crewId !== null) {
      this.agents = this.agentsService.getAgentsByCrewId(this.crewId);
    }
  }

  //VALIDATORS
  validateTasks(): boolean {
    this.validationErrors = [];
    let isValid = true;

    this.tempTasks.forEach((task, rowIndex) => {
      if (!task.title || task.title.length < 3) {
        this.validationErrors.push(
          `Error in row ${
            rowIndex + 1
          }, column Title: Title is required and must be at least 3 characters long.`
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
        this.tasks = JSON.parse(JSON.stringify(this.tempTasks));
        this.tasksService.updateTasksByCrewId(this.crewId!, this.tasks);
        console.log('Tasks saved:', this.tasks);
      }
    } else {
      console.log('Validation Errors:', this.validationErrors);
    }
  }

  //DELETE
  deleteTask(taskId: number) {
    if (
      window.confirm(
        'Are you sure you want to delete this task? This action cannot be undone.'
      )
    ) {
      this.tempTasks = this.tempTasks.filter((task) => task.id !== taskId);

      if (this.validateTasks()) {
        this.tasks = JSON.parse(JSON.stringify(this.tempTasks));
        this.tasksService.updateTasksByCrewId(this.crewId!, this.tasks);
        console.log('Tasks updated after deletion:', this.tasks);
      } else {
        console.log('Validation Errors:', this.validationErrors);
      }
    }
  }

  navigateToAddTask() {
    this.router.navigate([`/crew/${this.crewId}/tasks/add`]);
  }
}
