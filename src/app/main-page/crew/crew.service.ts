import { Injectable, signal } from '@angular/core';
import { Crew } from './crew.model';
import { AgentsService } from '../agents/agents.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  private crewsSignal = signal<Crew[]>([]);

  constructor(
    private agentsService: AgentsService,
    private tasksService: TasksService
  ) {
    this.loadCrewsFromLocalStorage();
  }

  //GET
  getCrews() {
    return this.crewsSignal;
  }

  getCrewsByUserId(userId: number) {
    return this.crewsSignal().filter((crew) => crew.userId === userId);
  }

  private loadCrewsFromLocalStorage(): void {
    const storedCrews = localStorage.getItem('crews');
    if (storedCrews) {
      this.crewsSignal.set(JSON.parse(storedCrews));
    }
  }

  //CREATE
  createCrew(
    name: string,
    userId: number,
    process: 'sequential' | 'hierarchical' = 'sequential'
  ): Crew {
    const newCrew: Crew = {
      id: Math.floor(Math.random() * 1000000),
      name,
      userId,
      process,
    };
    this.crewsSignal.update((crews) => [...crews, newCrew]);
    this.saveCrewsToLocalStorage();
    return newCrew;
  }

  //UPDATE, SAVE
  private saveCrewsToLocalStorage(): void {
    localStorage.setItem('crews', JSON.stringify(this.crewsSignal()));
  }

  //DELETE
  deleteCrew(crewId: number): void {
    // Delete agents and tasks
    this.tasksService.deleteTasksByCrewId(crewId);
    this.agentsService.deleteAgentsByCrewId(crewId);

    //Delete crew
    this.crewsSignal.update((crews) =>
      crews.filter((crew) => crew.id !== crewId)
    );

    this.saveCrewsToLocalStorage();
  }
}
