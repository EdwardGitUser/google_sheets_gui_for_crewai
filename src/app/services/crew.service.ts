import { Injectable, signal } from '@angular/core';
import { Crew } from '../shared/models/crew.model';
import { AgentsService } from './agents.service';
import { TasksService } from './tasks.service';

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  private crewsSignal = signal<Crew[]>(this.loadCrewsFromLocalStorage());

  constructor(
    private agentsService: AgentsService,
    private tasksService: TasksService
  ) {}

  //GET
  getCrews(): readonly Crew[] {
    return this.crewsSignal();
  }

  getCrewsByUserId(userId: string) {
    return this.crewsSignal().filter((crew) => crew.userId === userId);
  }

  getCrewById(crewId: string): Crew | undefined {
    return this.crewsSignal().find((crew) => crew.id === crewId);
  }

  private loadCrewsFromLocalStorage(): Crew[] {
    try {
      const storedCrews = localStorage.getItem('crews');
      return storedCrews ? JSON.parse(storedCrews) : [];
    } catch (error) {
      console.error('Error loading crews from localStorage', error);
      return [];
    }
  }

  //CREATE
  createCrew(
    name: string,
    userId: string,
    process: 'sequential' | 'hierarchical' = 'sequential'
  ): Crew {
    const newCrew: Crew = {
      id: Math.floor(Math.random() * 10000).toString(),
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
  deleteCrew(crewId: string): void {
    const crewExists = this.crewsSignal().some((crew) => crew.id === crewId);
    if (!crewExists) {
      console.error('Attempted to delete a crew that does not exist.');
      return;
    }

    this.tasksService.deleteTasksByCrewId(crewId);
    this.agentsService.deleteAgentsByCrewId(crewId);

    this.crewsSignal.update((crews) =>
      crews.filter((crew) => crew.id !== crewId)
    );

    this.saveCrewsToLocalStorage();
  }
}