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
      this.tasks = []; 
      this.saveTasksToLocalStorage();
    }
  }


  getTasksByCrewId(crewId: number): Task[] {
    return this.tasks.filter((task) => task.crewId === crewId);
  }


  getTasksByAgentId(agentId: number): Task[] {
    return this.tasks.filter((task) => task.agentId === agentId);
  }


  addTask(task: Task): void {
    this.tasks.push(task);
    this.saveTasksToLocalStorage();
  }


  updateTasksByCrewId(crewId: number, updatedTasks: Task[]): void {
    this.tasks = this.tasks.map((task) =>
      task.crewId === crewId
        ? updatedTasks.find((t) => t.id === task.id) || task
        : task
    );
    this.saveTasksToLocalStorage();
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  private saveTasksToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }


  private loadTasksFromLocalStorage(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }
}
