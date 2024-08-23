import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgentsService } from '../main-page/agents/agents.service';
import { TasksService } from '../main-page/tasks/tasks.service';
import { Agent } from '../main-page/agents/agents.model';
import { Task } from '../main-page/tasks/task.model';

@Component({
  selector: 'app-kickoff',
  standalone: true,
  imports: [],
  templateUrl: './kickoff.component.html',
  styleUrls: ['./kickoff.component.css'],
})
export class KickoffComponent implements OnInit {
  crewId: number | null = null;
  agents: Agent[] = [];
  tasks: Task[] = [];
  canLoadTemplate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private agentsService: AgentsService,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    // Get the crewId from the route parameters
    this.crewId = +this.route.snapshot.paramMap.get('id')!;

    // Load agents and tasks based on the crewId
    this.loadAgentsAndTasks();
  }

  private loadAgentsAndTasks(): void {
    if (this.crewId !== null) {
      // Load agents
      this.agents = this.agentsService.getAgentsByCrewId(this.crewId);

      // Load tasks for the crew
      this.tasks = this.tasksService.getTasksByCrewId(this.crewId);

      // Check if there is at least one agent, at least one task, and all agents have tasks
      this.canLoadTemplate =
        this.agents.length > 0 && // At least one agent
        this.tasks.length > 0 && // At least one task
        this.agents.every((agent) =>
          this.tasks.some((task) => task.agentId === agent.id)
        );
    }
  }
}
