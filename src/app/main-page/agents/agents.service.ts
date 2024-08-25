import { Injectable, signal } from '@angular/core';
import { Agent } from './agents.model';
import { TasksService } from '../tasks/tasks.service';

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

  getAgentsByCrewId(crewId: number): Agent[] {
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
    console.log('before', this.agentsSignal);
    this.agentsSignal.update((agents) => [...agents, newAgent]);
    this.saveAgentsToLocalStorage();
    console.log(this.agentsSignal);

    return newAgent;
  }

  //UPDATE
  updateAgentsByCrewId(crewId: number, updatedAgents: Agent[]): void {
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
  deleteAgentsByCrewId(crewId: number): void {
    this.agentsSignal.update((agents) =>
      agents.filter((agent) => agent.crewId !== crewId)
    );

    this.saveAgentsToLocalStorage();
  }

  deleteAgentById(crewId: number, agentId: number): void {
    this.tasksService.updateTasksForDeletedAgent(crewId, agentId);

    this.agentsSignal.update((agents) =>
      agents.filter((agent) => agent.id !== agentId)
    );

    this.saveAgentsToLocalStorage();
  }
}
