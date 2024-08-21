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
      this.tasks = this.getInitialTasks();
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

  // Save tasks to local storage
  private saveTasksToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Load tasks from local storage
  private loadTasksFromLocalStorage(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  // Initial dummy tasks
  private getInitialTasks(): Task[] {
    return [
      {
        id: 1001,
        crewId: 727751, // Crew 1 (test1)
        agentId: 1, // Assuming you have an agent with id 1
        title: 'Task 1 for Crew 1',
        description: 'Description for Task 1 of Crew 1',
        expected_output: 'Expected output for Task 1',
      },
      {
        id: 1002,
        crewId: 727751, // Crew 1 (test1)
        agentId: 2, // Assuming you have an agent with id 2
        title: 'Task 2 for Crew 1',
        description: 'Description for Task 2 of Crew 1',
        expected_output: 'Expected output for Task 2',
      },
      {
        id: 2001,
        crewId: 736798, // Crew 2 (test2)
        agentId: 3, // Assuming you have an agent with id 3
        title: 'Task 1 for Crew 2',
        description: 'Description for Task 1 of Crew 2',
        expected_output: 'Expected output for Task 1',
      },
      {
        id: 2002,
        crewId: 736798, // Crew 2 (test2)
        agentId: 4, // Assuming you have an agent with id 4
        title: 'Task 2 for Crew 2',
        description: 'Description for Task 2 of Crew 2',
        expected_output: 'Expected output for Task 2',
      },
    ];
  }
}
