import { Component, computed, OnInit, signal } from '@angular/core';
import { CrewService } from './crew/crew.service';
import { Crew } from './crew/crew.model';
import { AuthService } from '../auth/auth.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

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
  crewId = signal<number | null>(null);
  selectedCrewName = signal<string | null>(null);

  constructor(
    private router: Router,
    private crewService: CrewService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/' || event.urlAfterRedirects === '/') {
          this.clearCrewId();
        }
      }
    });

    const storedCrewId = localStorage.getItem('currentCrewId');
    if (storedCrewId) {
      const crewIdNumber = +storedCrewId;
      this.crewId.set(crewIdNumber);
      const crew = this.crews().find((crew) => crew.id === crewIdNumber);
      this.selectedCrewName.set(crew ? crew.name : null);
    }
  }

  get username(): string | null {
    return this.authService.currentUser?.username || null;
  }
  checkId(): boolean {
    return localStorage.getItem('currentCrewId') !== null;
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
    this.selectedCrewName.set(selectedCrew ? selectedCrew.name : null);
    if (window.confirm('Are you sure you want to view agents for this crew?')) {
      this.crewId.set(crewId);
      localStorage.setItem('currentCrewId', String(crewId));
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
      this.crewId() !== null &&
      window.confirm('Are you sure you want to delete this crew?')
    ) {
      this.crewService.deleteCrew(this.crewId()!);
      this.clearCrewId();
      this.router.navigate(['/']);
    }
  }

  clearCrewId() {
    this.crewId.set(null);
    this.selectedCrewName.set(null);
    localStorage.removeItem('currentCrewId');
  }
}
