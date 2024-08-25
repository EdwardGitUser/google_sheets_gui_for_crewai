import { Component, computed, OnInit } from '@angular/core';
import { CrewService } from './crew/crew.service';

import { AuthService } from '../auth/auth.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf, NgFor, RouterModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  crews = computed(() =>
    this.crewService
      .getCrews()
      .filter((crew) => crew.userId === this.authService.currentUser?.id)
  );

  hovered = false;
  crewId: string | null = null;

  constructor(
    private router: Router,
    private crewService: CrewService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  get username(): string | null {
    return this.authService.currentUser?.username || null;
  }

  get isLoggedIn(): boolean {
    return !!this.authService.currentUser;
  }

  onHover() {
    if (this.isLoggedIn) {
      this.hovered = true;
    }
  }

  onLeave() {
    this.hovered = false;
  }

  viewAgents(crewId: string) {
    if (window.confirm('Are you sure you want to view agents for this crew?')) {
      this.crewId = crewId;
      localStorage.setItem('currentCrewId', String(crewId));
      this.router.navigate([`/crew/${crewId}/google-sheet`]);
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

      this.router.navigate(['/']);
      localStorage.removeItem('currentCrewId');
    }
  }
}
