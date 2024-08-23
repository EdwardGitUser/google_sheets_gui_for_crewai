import { Component } from '@angular/core';
import { TableAgentsComponent } from '../agents/table-agents/table-agents.component';
import { TaskTableComponent } from '../tasks/task-table/task-table.component';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CrewService } from '../crew/crew.service';

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
  crewId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private crewService: CrewService
  ) {}

  ngOnInit(): void {
    this.crewId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.crewId);
  }

  deleteCrew(): void {
    if (
      this.crewId !== null &&
      window.confirm('Are you sure you want to delete this crew?')
    ) {
      this.crewService.deleteCrew(this.crewId);
      this.crewId = null;

      this.router.navigate(['/']);
      localStorage.removeItem('currentCrewId');
    }
  }

  navigateToKickoff() {
    this.router.navigate(['kickoff'], { relativeTo: this.route });
  }
}
