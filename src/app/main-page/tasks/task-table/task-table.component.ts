import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { NgClass, NgFor } from '@angular/common';
import { TasksService } from '../tasks.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentsService } from '../../agents/agents.service';
import { Agent } from '../../agents/agents.model';
import { isAgentValid } from '../task-table-validators'; // Import the validator
@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [NgClass, NgFor, FormsModule, RouterModule],
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css'],
})
export class TaskTableComponent implements OnInit {
  tasks: Task[] = [];

  tempTasks: Task[] = []; //COPY FOR TABLE SO NGMODEL DOES NOT EFFECT THE ORIGINAL ARRAY

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

  reloadTasks() {
    this.tempTasks = JSON.parse(JSON.stringify(this.tasks));
    console.log('Tasks reloaded to original state:', this.tempTasks);
  }

  //VALIDATORS
  validateTasks(): boolean {
    this.validationErrors = [];
    let isValid = true;

    this.tempTasks.forEach((task, rowIndex) => {
      // Validate Title
      if (!task.title || task.title.length < 3) {
        this.validationErrors.push(
          `Error in row ${
            rowIndex + 1
          }, column Title: Title is required and must be at least 3 characters long.`
        );
        isValid = false;
      }

      // Validate Assigned Agent
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
  //check if agentId is valid

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
      //returns filtered array
      this.tempTasks = this.tasksService.deleteTaskById(this.tempTasks, taskId);

      console.log('Temp tasks after deletion:', this.tempTasks);
    }
  }

  //NAVIGATION
  navigateToAddTask() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
}
