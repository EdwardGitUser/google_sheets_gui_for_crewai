import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // title = 'google_sheets_gui_crewai';
  isLoggedIn = signal(false);
  username: string | null = null;
  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    if (this.isLoggedIn()) {
      this.username = this.authService.getLoggedInUsername();
    }
  }
}
