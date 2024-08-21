import { Component } from '@angular/core';
import { TaskTableComponent } from './task-table/task-table.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskTableComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {}
