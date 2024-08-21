import { Injectable } from '@angular/core';
import { Agent } from './agents.model';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private agents: Agent[] = this.loadAgentsFromLocalStorage();

  constructor() {
    // Load agents from localStorage if they exist
    const storedAgents = localStorage.getItem('agents');
    if (storedAgents) {
      this.agents = JSON.parse(storedAgents);
    } else {
      this.agents = this.getInitialAgents(); // Set initial dummy data
      this.saveAgentsToLocalStorage(); // Save initial dummy data
    }
  }

  // Retrieve agents by crew ID
  getAgentsByCrewId(crewId: number): Agent[] {
    return this.agents.filter((agent) => agent.crewId === crewId);
  }

  // Add a new agent and store in local storage
  addAgent(agent: Agent): void {
    this.agents.push(agent);
    this.saveAgentsToLocalStorage();
  }

  // Save agents to local storage
  private saveAgentsToLocalStorage(): void {
    localStorage.setItem('agents', JSON.stringify(this.agents));
  }

  // Load agents from local storage
  private loadAgentsFromLocalStorage(): Agent[] {
    const agents = localStorage.getItem('agents');
    return agents ? JSON.parse(agents) : [];
  }

  // Initial dummy agents for testing
  private getInitialAgents(): Agent[] {
    return [
      {
        id: 1,
        crewId: 1,
        name: 'Agent Alpha',
        role: 'Leader',
        goal: 'Complete mission X',
        backstory: 'A seasoned leader with years of experience.',
        verbose: false,
        tool: 'Laser Gun',
      },
      {
        id: 2,
        crewId: 1,
        name: 'Agent Beta',
        role: 'Sniper',
        goal: 'Eliminate high-value targets',
        backstory: 'An expert marksman with unmatched precision.',
        verbose: false,
        tool: 'Sniper Rifle',
      },
      {
        id: 3,
        crewId: 1,
        name: 'Agent Gamma',
        role: 'Scout',
        goal: 'Gather intelligence',
        backstory: 'A quick and silent operator.',
        verbose: true,
        tool: 'Drone',
      },
    ];
  }
}
