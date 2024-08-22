import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks: Task[] = [];

  constructor() {
    this.tasks = this.loadTasksFromLocalStorage();
  }

  //GET
  getTasks(): Task[] {
    return this.tasks;
  }

  getTasksByCrewId(crewId: number): Task[] {
    return this.tasks.filter((task) => task.crewId === crewId);
  }

  getTasksByAgentId(agentId: number): Task[] {
    return this.tasks.filter((task) => task.agentId === agentId);
  }

  private loadTasksFromLocalStorage(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  //CREATE
  addTask(
    crewId: number,
    agentId: number,
    title: string,
    description: string,
    expected_output: string
  ): Task {
    const newTask: Task = {
      id: Math.floor(Math.random() * 10000),
      crewId,
      agentId,
      title,
      description,
      expected_output,
    };

    this.tasks.push(newTask);
    this.saveTasksToLocalStorage();
    return newTask;
  }

  //UPDATE
  updateTasksByCrewId(crewId: number, updatedTasks: Task[]): void {
    this.tasks = this.tasks.map((task) =>
      task.crewId === crewId
        ? updatedTasks.find((t) => t.id === task.id) || task
        : task
    );
    this.saveTasksToLocalStorage();
  }

  private saveTasksToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  //DELETE
  deleteTasksByCrewId(crewId: number): void {
    this.tasks = this.tasks.filter((task) => task.crewId !== crewId);
    this.saveTasksToLocalStorage();
  }
}
