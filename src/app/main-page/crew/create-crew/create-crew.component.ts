import { Component } from '@angular/core';
import { CrewService } from '../crew.service';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-crew',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-crew.component.html',
  styleUrl: './create-crew.component.css',
})
export class CreateCrewComponent {
  crewName: string = '';

  constructor(
    private crewService: CrewService,
    private authService: AuthService,
    private router: Router
  ) {}

  createCrew() {
    if (this.authService.currentUser) {
      this.crewService.createCrew(
        this.crewName,
        this.authService.currentUser.id
      );
      this.router.navigate(['/']);
    }
  }
}
