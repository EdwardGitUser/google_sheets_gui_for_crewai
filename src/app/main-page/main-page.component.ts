import { Component, OnInit, signal } from '@angular/core';
import { CrewService } from './crew/crew.service';
import { Crew } from './crew/crew.model';
import { AuthService } from '../auth/auth.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { TasksService } from './tasks/tasks.service';
import { AgentsService } from './agents/agents.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [NgIf, NgFor, RouterOutlet, NgClass, RouterModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  crews: Crew[] = [];
  hovered = false;
  crewId: number | null = null;

  constructor(
    private router: Router,
    private crewService: CrewService,
    private agentsService: AgentsService,
    private tasksService: TasksService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.loadCrews();
  }

  navigateToKickoff(): void {
    this.router.navigate(['/kickoff']);
  }

  get username(): string | null {
    return this.authService.currentUser?.username || null;
  }

  isLoggedIn(): boolean {
    return !!this.authService.currentUser;
  }

  loadCrews() {
    if (this.isLoggedIn()) {
      this.crews = this.crewService.getCrewsByUserId(
        this.authService.currentUser!.id
      );
    }
  }

  onHover() {
    if (this.isLoggedIn()) {
      this.hovered = true;
    }
  }

  onLeave() {
    this.hovered = false;
  }

  viewAgents(crewId: number) {
    if (window.confirm('Are you sure you want to view agents for this crew?')) {
      this.crewId = crewId; // Store the selected crew ID
      this.router.navigate([`/crew/${crewId}/agents`]);
    }
  }

  createCrew() {
    if (window.confirm('Are you sure you want to create a new crew?')) {
      this.router.navigate(['/create-crew']);
    }
  }

  deleteCrew() {
    if (
      this.crewId !== null &&
      window.confirm('Are you sure you want to delete this crew?')
    ) {
      this.crewService.deleteCrew(this.crewId);
      this.crewId = null; // Reset the selected crew ID
      this.router.navigate(['/']); // Redirect back to the main page
      this.loadCrews(); // Reload the crew list
    }
  }
}
