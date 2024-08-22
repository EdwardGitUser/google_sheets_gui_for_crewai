import { Injectable, signal } from '@angular/core';
import { Crew } from './crew.model';

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  private crewsSignal = signal<Crew[]>([]);

  constructor() {
    const storedCrews = localStorage.getItem('crews');
    if (storedCrews) {
      this.crewsSignal.set(JSON.parse(storedCrews));
    } else {
      this.saveCrewsToLocalStorage();
    }
  }

  getCrews() {
    return this.crewsSignal;
  }

  getCrewsByUserId(userId: number) {
    return this.crewsSignal().filter((crew) => crew.userId === userId);
  }

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

  deleteCrew(crewId: number): void {
    this.crewsSignal.update((crews) =>
      crews.filter((crew) => crew.id !== crewId)
    );
    this.saveCrewsToLocalStorage();
  }

  private saveCrewsToLocalStorage(): void {
    localStorage.setItem('crews', JSON.stringify(this.crewsSignal()));
  }
}
