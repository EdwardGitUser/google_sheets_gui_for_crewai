import { Injectable } from '@angular/core';
import { Agent } from './agents.model';
import { TasksService } from '../tasks/tasks.service';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private agents: Agent[] = [];

  constructor(private tasksService: TasksService) {
    this.agents = this.loadAgentsFromLocalStorage();
  }

  //GET
  getAgents(): Agent[] {
    return this.agents;
  }

  getAgentsByCrewId(crewId: number): Agent[] {
    return this.agents.filter((agent) => agent.crewId === crewId);
  }

  private loadAgentsFromLocalStorage(): Agent[] {
    const agents = localStorage.getItem('agents');
    return agents ? JSON.parse(agents) : [];
  }

  //CREATE
  createAgent(
    name: string,
    crewId: number,
    role: string,
    goal: string,
    backstory: string,
    verbose: boolean = false,
    tool: string
  ): Agent {
    const newAgent: Agent = {
      id: Math.floor(Math.random() * 1000000),
      crewId,
      name,
      role,
      goal,
      backstory,
      verbose,
      tool,
    };

    this.agents.push(newAgent);
    this.saveAgentsToLocalStorage();
    return newAgent;
  }

  //UPDATE
  updateAgentsByCrewId(crewId: number, updatedAgents: Agent[]): void {
    this.agents = this.agents.filter((agent) => agent.crewId !== crewId);

    this.agents.push(...updatedAgents);

    this.saveAgentsToLocalStorage();
  }

  private saveAgentsToLocalStorage(): void {
    localStorage.setItem('agents', JSON.stringify(this.agents));
  }

  //DELETE
  deleteAgentsByCrewId(crewId: number): void {
    this.agents = this.agents.filter((agent) => agent.crewId !== crewId);
    this.saveAgentsToLocalStorage();
  }

  deleteAgentById(crewId: number, agents: Agent[], agentId: number): Agent[] {
    this.tasksService.updateTasksForDeletedAgent(crewId, agentId);

    return agents.filter((agent) => agent.id !== agentId);
  }
}
