import { Injectable } from '@angular/core';
import { Crew } from './crew.model';

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  private crews: Crew[] = [];

  constructor() {
    const storedCrews = localStorage.getItem('crews');
    if (storedCrews) {
      this.crews = JSON.parse(storedCrews);
    } else {
      this.saveCrewsToLocalStorage();
    }
  }

  getCrews(): Crew[] {
    return this.crews;
  }

  getCrewsByUserId(userId: number): Crew[] {
    return this.crews.filter((crew) => crew.userId === userId);
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
    this.crews.push(newCrew);
    this.saveCrewsToLocalStorage();
    return newCrew;
  }

  deleteCrew(crewId: number): void {
    this.crews = this.crews.filter((crew) => crew.id !== crewId);
    this.saveCrewsToLocalStorage();
  }

  private saveCrewsToLocalStorage(): void {
    localStorage.setItem('crews', JSON.stringify(this.crews));
  }
}
