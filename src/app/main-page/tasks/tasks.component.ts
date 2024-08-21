import { Component, OnInit } from '@angular/core';
import { Task } from './task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from './tasks.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  crewId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.crewId = +params['id'];
      this.loadTasks();
    });
  }

  loadTasks() {
    this.tasks = this.tasksService.getTasksByCrewId(this.crewId);
  }

  navigateToAddTask() {
    this.router.navigate([`/crew/${this.crewId}/tasks/add`]);
  }
}
