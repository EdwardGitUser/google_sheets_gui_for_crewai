import { Injectable, signal } from '@angular/core';
import { Crew } from '../shared/models/crew.model';

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  private crewsSignal = signal<Crew[]>(this.loadCrewsFromLocalStorage());

  constructor() {}

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
    process: 'sequential' | 'hierarchical' = 'sequential',
    llm: 'gpt-4mini' | 'gpt-4' | 'gpt-4o' = 'gpt-4'
  ): Crew {
    const newCrew: Crew = {
      id: Math.floor(Math.random() * 10000).toString(),
      name,
      userId,
      process,
      llm,
    };
    this.crewsSignal.update((crews) => [...crews, newCrew]);
    this.saveCrewsToLocalStorage();
    return newCrew;
  }

  //UPDATE, SAVE
  updateCrew(updatedCrew: Crew): void {
    this.crewsSignal.update((crews) =>
      crews.map((crew) => (crew.id === updatedCrew.id ? updatedCrew : crew))
    );
    this.saveCrewsToLocalStorage();
  }

  updateCrewProcess(
    crewId: string,
    newProcess: 'sequential' | 'hierarchical'
  ): void {
    this.crewsSignal.update((crews) =>
      crews.map((crew) => {
        if (crew.id === crewId) {
          return { ...crew, process: newProcess };
        }
        return crew;
      })
    );
    this.saveCrewsToLocalStorage();
  }

  updateCrewLlm(
    crewId: string,
    newLlm: 'gpt-4mini' | 'gpt-4' | 'gpt-4o'
  ): void {
    this.crewsSignal.update((crews) =>
      crews.map((crew) => {
        if (crew.id === crewId) {
          return { ...crew, llm: newLlm };
        }
        return crew;
      })
    );
    this.saveCrewsToLocalStorage();
  }

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

    this.crewsSignal.update((crews) =>
      crews.filter((crew) => crew.id !== crewId)
    );

    this.saveCrewsToLocalStorage();
  }
}
