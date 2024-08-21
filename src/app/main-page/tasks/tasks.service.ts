import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks: Task[] = this.loadTasksFromLocalStorage();

  constructor() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    } else {
      this.tasks = []; // Initialize with an empty array
      this.saveTasksToLocalStorage();
    }
  }

  // Get tasks by crewId
  getTasksByCrewId(crewId: number): Task[] {
    return this.tasks.filter((task) => task.crewId === crewId);
  }

  // Get tasks by agentId
  getTasksByAgentId(agentId: number): Task[] {
    return this.tasks.filter((task) => task.agentId === agentId);
  }

  // Add a new task and save it to local storage
  addTask(task: Task): void {
    this.tasks.push(task);
    this.saveTasksToLocalStorage();
  }

  // Update tasks by crewId
  updateTasksByCrewId(crewId: number, updatedTasks: Task[]): void {
    this.tasks = this.tasks.map((task) =>
      task.crewId === crewId
        ? updatedTasks.find((t) => t.id === task.id) || task
        : task
    );
    this.saveTasksToLocalStorage();
  }
  // Get all tasks
  getTasks(): Task[] {
    return this.tasks;
  }
  // Save tasks to local storage
  private saveTasksToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Load tasks from local storage
  private loadTasksFromLocalStorage(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }
}
