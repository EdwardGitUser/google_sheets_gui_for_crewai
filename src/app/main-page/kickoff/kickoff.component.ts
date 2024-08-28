import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AgentsService } from '../../services/agents.service';
import { TasksService } from '../../services/tasks.service';
import { Agent } from '../../shared/models/agents.model';
import { Task } from '../../shared/models/task.model';
import { Crew } from '../../shared/models/crew.model';
import { CrewService } from '../../services/crew.service';

@Component({
  selector: 'app-kickoff',
  standalone: true,
  imports: [],
  templateUrl: './kickoff.component.html',
  styleUrls: ['./kickoff.component.css'],
})
export class KickoffComponent implements OnInit {
  crewId: string | null = null;

  crew!: Crew | undefined;
  agents!: Agent[];
  tasks!: Task[];

  canLoadTemplate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private crewService: CrewService,
    private agentsService: AgentsService,
    private tasksService: TasksService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.crewId = this.route.snapshot.paramMap.get('id')!;
    if (this.crewId) {
      this.loadData(this.crewId);
    }
  }

  private loadData(crewId: string): void {
    if (crewId) {
      this.crew = this.crewService.getCrewById(crewId);

      this.agents = this.agentsService.getAgentsByCrewId(crewId);
      this.tasks = this.tasksService.getTasksByCrewId(crewId);

      this.canLoadTemplate = this.isAgentsTasksValid();
    }
  }

  private isAgentsTasksValid(): boolean {
    return (
      this.agents.length > 0 &&
      this.tasks.length > 0 &&
      this.agents.every((agent) =>
        this.tasks.some((task) => task.agentId === agent.id)
      )
    );
  }



  goBack(): void {
    this.location.back();
  }
}
