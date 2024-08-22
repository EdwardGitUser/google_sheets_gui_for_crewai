import { Injectable, signal } from '@angular/core';
import { Crew } from './crew.model';

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  private crewsSignal = signal<Crew[]>([]); // Initialize the signal with an empty array

  constructor() {
    const storedCrews = localStorage.getItem('crews');
    if (storedCrews) {
      this.crewsSignal.set(JSON.parse(storedCrews)); // Set the initial value from localStorage
    } else {
      this.saveCrewsToLocalStorage();
    }
  }

  getCrews() {
    return this.crewsSignal; // Return the signal
  }

  getCrewsByUserId(userId: number) {
    return this.crewsSignal().filter((crew) => crew.userId === userId); // Filtered list based on userId
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
    this.crewsSignal.update((crews) => [...crews, newCrew]); // Update the signal
    this.saveCrewsToLocalStorage();
    return newCrew;
  }

  deleteCrew(crewId: number): void {
    this.crewsSignal.update((crews) =>
      crews.filter((crew) => crew.id !== crewId)
    ); // Update the signal after deletion
    this.saveCrewsToLocalStorage();
  }

  private saveCrewsToLocalStorage(): void {
    localStorage.setItem('crews', JSON.stringify(this.crewsSignal()));
  }
}
