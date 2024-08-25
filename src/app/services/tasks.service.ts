import { Injectable, signal } from '@angular/core';
import { Task } from '../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasksSignal = signal<Task[]>(this.loadTasksFromLocalStorage());

  constructor() {
    console.log(this.tasksSignal());
  }

  //GET
  getTasks(): readonly Task[] {
    return this.tasksSignal();
  }

  getTasksByCrewId(crewId: string): Task[] {
    return this.tasksSignal().filter((task) => task.crewId === crewId);
  }

  getTasksByAgentId(agentId: string): Task[] {
    return this.tasksSignal().filter((task) => task.agentId === agentId);
  }

  private loadTasksFromLocalStorage(): Task[] {
    try {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage', error);
      return [];
    }
  }

  //CREATE
  onCreateTask(
    crewId: string,
    agentId: string,
    title: string,
    description: string,
    expected_output: string
  ): Task {
    const newTask: Task = {
      id: Math.floor(Math.random() * 10000).toString(),
      crewId,
      agentId,
      title,
      description,
      expected_output,
    };

    console.log('Before adding task:', this.tasksSignal());
    this.tasksSignal.update((tasks) => [...tasks, newTask]);
    this.saveTasksToLocalStorage();
    console.log('After adding task:', this.tasksSignal());

    return newTask;
  }

  //UPDATE

  updateTasksByCrewId(crewId: string, updatedTasks: Task[]): void {
    this.tasksSignal.update((tasks) => [
      ...tasks.filter((task) => task.crewId !== crewId),
      ...updatedTasks,
    ]);

    this.saveTasksToLocalStorage();
  }

  private saveTasksToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasksSignal()));
  }

  updateTasksForDeletedAgent(crewId: string, agentId: string): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((task) =>
        task.crewId === crewId && task.agentId === agentId
          ? { ...task, agentId: null }
          : task
      )
    );
    this.saveTasksToLocalStorage();
  }

  //DELETE
  deleteTasksByCrewId(crewId: string): void {
    this.tasksSignal.update((tasks) =>
      tasks.filter((task) => task.crewId !== crewId)
    );
    this.saveTasksToLocalStorage();
  }

  deleteTaskById(taskId: string): void {
    this.tasksSignal.update((tasks) =>
      tasks.filter((task) => task.id !== taskId)
    );
    this.saveTasksToLocalStorage();
  }
}
