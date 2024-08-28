import { Injectable, signal } from '@angular/core';
import { Agent } from '../shared/models/agents.model';
import { TasksService } from './tasks.service';
import { CrewService } from './crew.service';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  private agentsSignal = signal<Agent[]>(this.loadAgentsFromLocalStorage());

  constructor(private tasksService: TasksService) {}

  //GET
  getAgents(): readonly Agent[] {
    return this.agentsSignal();
  }

  getAgentsByCrewId(crewId: string): Agent[] {
    return this.agentsSignal().filter((agent) => agent.crewId === crewId);
  }

  private loadAgentsFromLocalStorage(): Agent[] {
    try {
      const storedAgents = localStorage.getItem('agents');
      return storedAgents ? JSON.parse(storedAgents) : [];
    } catch (error) {
      console.error('Error loading agents from localStorage', error);
      return [];
    }
  }

  //CREATE
  createAgent(
    name: string,
    crewId: string,
    role: string,
    goal: string,
    backstory: string,
    verbose: boolean = false,
    tool: string
  ): Agent {
    const newAgent: Agent = {
      id: Math.floor(Math.random() * 10000).toString(),
      crewId,
      name,
      role,
      goal,
      backstory,
      verbose,
      tool,
    };

    this.agentsSignal.update((agents) => [...agents, newAgent]);
    this.saveAgentsToLocalStorage();
    console.log(this.agentsSignal());

    return newAgent;
  }

  //UPDATE
  updateAgentsByCrewId(crewId: string, updatedAgents: Agent[]): void {
    this.agentsSignal.update((agents) => [
      ...agents.filter((agent) => agent.crewId !== crewId),
      ...updatedAgents,
    ]);

    this.saveAgentsToLocalStorage();
  }

  private saveAgentsToLocalStorage(): void {
    localStorage.setItem('agents', JSON.stringify(this.agentsSignal()));
  }

  // DELETE
  deleteAgentsByCrewId(crewId: string): void {
    this.agentsSignal.update((agents) =>
      agents.filter((agent) => agent.crewId !== crewId)
    );

    this.saveAgentsToLocalStorage();
  }

  deleteAgentById(crewId: string, agentId: string): void {
    this.tasksService.updateTasksForDeletedAgent(crewId, agentId);

    this.agentsSignal.update((agents) =>
      agents.filter((agent) => agent.id !== agentId)
    );

    this.saveAgentsToLocalStorage();
  }
}
