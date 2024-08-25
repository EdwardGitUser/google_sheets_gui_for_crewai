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

@Component({
  selector: 'app-google-sheet',
  standalone: true,
  imports: [
    TableAgentsComponent,
    TaskTableComponent,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './google-sheet.component.html',
  styleUrl: './google-sheet.component.css',
})
export class GoogleSheetComponent {
  crewId = signal<string | null>(null);

  crewName = computed(() => {
    const currentCrewId = this.crewId();
    if (currentCrewId !== null) {
      const crew = this.crewService.getCrewById(currentCrewId);
      return crew ? crew.name : '';
    }
    return '';
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crewService: CrewService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.crewId.set(params['id']);
    });
  }

  deleteCrew(): void {
    const currentCrewId = this.crewId();
    if (
      this.crewId !== null &&
      window.confirm('Are you sure you want to delete this crew?')
    ) {
      this.crewService.deleteCrew(currentCrewId!);
      this.crewId.set(null);

      this.router.navigate(['/']);
      localStorage.removeItem('currentCrewId');
    }
  }

  navigateToKickoff() {
    this.router.navigate(['kickoff'], { relativeTo: this.route });
  }
}
