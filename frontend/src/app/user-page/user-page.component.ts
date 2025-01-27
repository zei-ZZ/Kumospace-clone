import { Component } from '@angular/core';
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
  selector: 'app-user-page',
  imports: [UserProfileComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {

}
