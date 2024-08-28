import { DecimalPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, FormsModule, DecimalPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  user: User | null = null;
  amountToAdd: number = 0;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.user = this.authService.getUserById(userId);
    }
  }

  addToBalance(): void {
    if (this.user && this.amountToAdd > 0) {
      this.authService.addToUserBalance(this.user.id, this.amountToAdd);
      // Update local user balance
      this.amountToAdd = 0; // Reset input field
    }
  }
}
