import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgClass } from '@angular/common';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  getUser(): User | null {
    return this.authService.currentUser;
  }

  logout() {
    this.authService.logout();

    this.router.navigate(['login']);
  }
}
