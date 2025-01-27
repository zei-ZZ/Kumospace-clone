import { Component, Input } from '@angular/core';
import { UserInterface } from '../shared/models/user';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  @Input() user!: UserInterface;

  ngAfterInit(): void {
      console.log(this.user);
  }
}
