import { Component, inject, Input } from '@angular/core';
import { UserInterface } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userService = inject(UserService);
  @Input() user!: UserInterface;

  getProfileImageUrl(): string {
    return this.userService.getProfileImageUrl(this.user);
  }
}
