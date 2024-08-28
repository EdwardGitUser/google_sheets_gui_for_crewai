import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AgentsService } from '../../services/agents.service';
import { TasksService } from '../../services/tasks.service';
import { Agent } from '../../shared/models/agents.model';
import { Task } from '../../shared/models/task.model';
import { Crew } from '../../shared/models/crew.model';
import { CrewService } from '../../services/crew.service';
import { SubmitService } from '../../services/api/submit.service';

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
  responseMessage: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private crewService: CrewService,
    private agentsService: AgentsService,
    private tasksService: TasksService,
    private submitService: SubmitService,
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
      if (this.canLoadTemplate) {
        this.submitData();
      }
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

  private submitData(): void {
    if (this.crew && this.agents && this.tasks) {
      this.submitService
        .submitCrewData(this.crew, this.agents, this.tasks)
        .subscribe({
          next: (response) => {
            this.responseMessage = response.message;
          },
          error: (error) => {
            console.error('Submission failed:', error);
          },
        });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
