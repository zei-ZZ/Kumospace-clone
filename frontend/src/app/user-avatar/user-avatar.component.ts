import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  imports: [],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css',
})
export class UserAvatarComponent {
  stream = input<MediaStream | null>(null);
  muted = input<boolean>(false);

  @Input() showProfilePicture: boolean = false;

  profilePicture = '/alex.jpg';
}
