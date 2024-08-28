import { DecimalPipe, NgIf } from '@angular/common';
import { Component, computed } from '@angular/core';
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
  userId: string | null = null;
  amountToAdd: number = 0;

  user = computed(() => {
    if (this.userId) {
      return this.authService.getUserById(this.userId);
    }
    return null;
  });

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
  }

  addToBalance(): void {
    if (this.user() && this.amountToAdd > 0) {
      this.authService.addToUserBalance(this.user()!.id, this.amountToAdd);
      this.amountToAdd = 0;
    }
  }
}
