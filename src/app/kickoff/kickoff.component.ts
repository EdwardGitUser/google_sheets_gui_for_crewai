import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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
  crewId: string | null = null;

  agents: Agent[] = [];
  tasks: Task[] = [];

  canLoadTemplate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private agentsService: AgentsService,
    private tasksService: TasksService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.crewId = this.route.snapshot.paramMap.get('id')!;
    this.loadAgentsAndTasks();
  }

  private loadAgentsAndTasks(): void {
    if (this.crewId !== null) {
      this.agents = this.agentsService.getAgentsByCrewId(this.crewId);
      this.tasks = this.tasksService.getTasksByCrewId(this.crewId);

      this.canLoadTemplate =
        this.agents.length > 0 &&
        this.tasks.length > 0 &&
        this.agents.every((agent) =>
          this.tasks.some((task) => task.agentId === agent.id)
        );
    }
  }

  goBack(): void {
    this.location.back();
  }
}
