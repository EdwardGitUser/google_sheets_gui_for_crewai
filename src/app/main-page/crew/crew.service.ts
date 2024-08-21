import { Injectable } from '@angular/core';
import { Crew } from './crew.model';

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  private crews: Crew[] = [];

  constructor() {
    // Load crews from localStorage if they exist
    const storedCrews = localStorage.getItem('crews');
    if (storedCrews) {
      this.crews = JSON.parse(storedCrews);
    } else {
      this.saveCrewsToLocalStorage(); // Save an empty array to local storage
    }
  }

  // Get all crews
  getCrews(): Crew[] {
    return this.crews;
  }

  // Get crews filtered by userId
  getCrewsByUserId(userId: number): Crew[] {
    return this.crews.filter((crew) => crew.userId === userId);
  }

  // Create a new crew
  createCrew(
    name: string,
    userId: number,
    process: 'sequential' | 'hierarchical' = 'sequential'
  ): Crew {
    const newCrew: Crew = {
      id: Math.floor(Math.random() * 1000000), // Generate a random ID
      name,
      userId,
      process,
    };
    this.crews.push(newCrew);
    this.saveCrewsToLocalStorage();
    return newCrew;
  }

  // Delete a crew by ID
  deleteCrew(crewId: number): void {
    this.crews = this.crews.filter((crew) => crew.id !== crewId);
    this.saveCrewsToLocalStorage();
  }

  // Save crews to localStorage
  private saveCrewsToLocalStorage(): void {
    localStorage.setItem('crews', JSON.stringify(this.crews));
  }
}
