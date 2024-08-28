import { Component, computed, signal } from '@angular/core';
import { TableAgentsComponent } from '../tables/table-agents/table-agents.component';
import { TaskTableComponent } from '../tables/task-table/task-table.component';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CrewService } from '../../services/crew.service';
import { TasksService } from '../../services/tasks.service';
import { AgentsService } from '../../services/agents.service';
import { Crew } from '../../shared/models/crew.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-google-sheet',
  standalone: true,
  imports: [
    TableAgentsComponent,
    TaskTableComponent,
    RouterModule,
    RouterOutlet,
    FormsModule,
  ],
  templateUrl: './google-sheet.component.html',
  styleUrl: './google-sheet.component.css',
})
export class GoogleSheetComponent {
  crewId!: string;
  crew!: Crew;
  selectedProcess: 'sequential' | 'hierarchical' = 'sequential';
  selectedLlm: 'gpt-4mini' | 'gpt-4' | 'gpt-4o' = 'gpt-4'; // Default LLM

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crewService: CrewService,
    private tasksService: TasksService,
    private agentsService: AgentsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const currentCrewId = params['id'];
      this.crewId = currentCrewId;

      if (currentCrewId) {
        const fetchedCrew = this.crewService.getCrewById(currentCrewId);
        if (fetchedCrew) {
          this.crew = fetchedCrew;
          this.selectedProcess = fetchedCrew.process;
          this.selectedLlm = fetchedCrew.llm;
        }
      }
    });
  }

  updateProcess(): void {
    if (this.crew) {
      this.crew.process = this.selectedProcess;
      this.crewService.updateCrewProcess(this.crew.id, this.selectedProcess);
    }
  }

  updateLlm(): void {
    if (this.crew) {
      this.crew.llm = this.selectedLlm;
      this.crewService.updateCrewLlm(this.crew.id, this.selectedLlm);
    }
  }

  navigateToKickoff() {
    if (window.confirm('Proceed to kickoff configurator?')) {
      this.router.navigate(['kickoff'], { relativeTo: this.route });
    }
  }

  deleteCrew(): void {
    const currentCrewId = this.crewId;
    if (window.confirm('Are you sure you want to delete this crew?')) {
      this.tasksService.deleteTasksByCrewId(currentCrewId!);
      this.agentsService.deleteAgentsByCrewId(currentCrewId!);

      this.crewService.deleteCrew(currentCrewId!);

      this.router.navigate(['/']);
      localStorage.removeItem('currentCrewId');
    }
  }
}
