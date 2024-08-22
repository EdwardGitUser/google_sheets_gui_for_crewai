import { Component, computed, OnInit, signal } from '@angular/core';
import { CrewService } from './crew/crew.service';
import { Crew } from './crew/crew.model';
import { AuthService } from '../auth/auth.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterOutlet, NgClass, RouterModule, NgIf, NgFor],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  crews = computed(() =>
    this.crewService
      .getCrews()()
      .filter((crew) => crew.userId === this.authService.currentUser?.id)
  );

  hovered = false;
  crewId: number | null = null;
  selectedCrewName: string | null = null;

  constructor(
    private router: Router,
    private crewService: CrewService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log(this.crews());
  }

  get username(): string | null {
    return this.authService.currentUser?.username || null;
  }

  isLoggedIn(): boolean {
    return !!this.authService.currentUser;
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
    const selectedCrew = this.crews().find((crew) => crew.id === crewId);
    this.selectedCrewName = selectedCrew ? selectedCrew.name : null;
    if (window.confirm('Are you sure you want to view agents for this crew?')) {
      this.crewId = crewId;
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
      this.crewId = null;
      this.selectedCrewName = null;
      this.router.navigate(['/']);
    }
  }
}
