import { Injectable } from '@angular/core';
import { Agent } from './agents.model';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private agents: Agent[] = this.loadAgentsFromLocalStorage();

  constructor() {
    const storedAgents = localStorage.getItem('agents');
    if (storedAgents) {
      this.agents = JSON.parse(storedAgents);
    } else {
      this.agents = this.getInitialAgents();
      this.saveAgentsToLocalStorage();
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

  // Save agents array to local storage
  saveAgents(agents: Agent[]): void {
    this.agents = agents;
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

  updateAgentsByCrewId(crewId: number, updatedAgents: Agent[]): void {
    // Filter out agents not belonging to the given crewId
    this.agents = this.agents.filter((agent) => agent.crewId !== crewId);

    // Add the updated agents for the crewId
    this.agents.push(...updatedAgents);

    // Save to local storage
    this.saveAgentsToLocalStorage();
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
