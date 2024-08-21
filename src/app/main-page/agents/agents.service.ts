import { Injectable } from '@angular/core';
import { Agent } from './agents.model';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private agents: Agent[];

  constructor() {
    const storedAgents = localStorage.getItem('agents');
    if (storedAgents) {
      this.agents = JSON.parse(storedAgents);
    } else {
      this.agents = [];
      this.saveAgentsToLocalStorage();
    }
  }

  getAgentsByCrewId(crewId: number): Agent[] {
    return this.agents.filter((agent) => agent.crewId === crewId);
  }

  addAgent(agent: Agent): void {
    this.agents.push(agent);
    this.saveAgentsToLocalStorage();
  }

  saveAgents(agents: Agent[]): void {
    this.agents = agents;
    this.saveAgentsToLocalStorage();
  }

  private saveAgentsToLocalStorage(): void {
    localStorage.setItem('agents', JSON.stringify(this.agents));
  }

  private loadAgentsFromLocalStorage(): Agent[] {
    const agents = localStorage.getItem('agents');
    return agents ? JSON.parse(agents) : [];
  }

  updateAgentsByCrewId(crewId: number, updatedAgents: Agent[]): void {
    this.agents = this.agents.filter((agent) => agent.crewId !== crewId);

    this.agents.push(...updatedAgents);

    this.saveAgentsToLocalStorage();
  }

  getAgents(): Agent[] {
    return this.agents;
  }
}
