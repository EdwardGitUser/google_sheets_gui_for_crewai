import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isLoggedIn = signal(false);
  username: string | null = null;
  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    if (this.isLoggedIn()) {
      this.username = this.authService.getLoggedInUsername();
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn.set(false);
    this.username = null;
    // this.router.navigate(['/login']); // Redirect to the login page after logout
  }
}
