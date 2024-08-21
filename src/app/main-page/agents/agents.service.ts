import { Injectable } from '@angular/core';
import { Agent } from './agents.model';
import { CrewService } from '../crew/crew.service';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private agents: Agent[] = [
    { id: 1, name: 'Agent Smith', crewId: 1 },
    { id: 2, name: 'Agent Johnson', crewId: 2 },
    { id: 3, name: 'Agent Brown', crewId: 1 },
    // Add more dummy agents as needed
  ];

  constructor(private crewService: CrewService) {}

  // Method to get agents filtered by crewId
  getAgentsByCrewId(crewId: number): Agent[] {
    return this.agents.filter((agent) => agent.crewId === crewId);
  }
}
