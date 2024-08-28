import { Component, computed, OnInit } from '@angular/core';
import { CrewService } from '../services/crew.service';

import { AuthService } from '../auth/auth.service';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterOutlet, NgClass, RouterModule, DecimalPipe],
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

  constructor(
    private router: Router,
    private crewService: CrewService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  get username(): string | null {
    return this.authService.currentUser?.username || null;
  }

  get balance(): number | null {
    return this.authService.currentUser?.balance || null;
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
      localStorage.setItem('currentCrewId', crewId);
      this.router.navigate([`/crew/${crewId}/google-sheet`]);
    }
  }

  createCrew() {
    if (window.confirm('Are you sure you want to create a new crew?')) {
      this.router.navigate(['/create-crew']);
    }
  }
}
