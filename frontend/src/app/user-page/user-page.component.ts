import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { UserInterface } from '../shared/models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-user-page',
  imports: [UserProfileComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  route = inject(ActivatedRoute);
  userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);

  user: UserInterface = new UserInterface();
 
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userid');
    if (userId !== null) this.getUserById(userId);
  }

  getUserById(id: string): void {
     this.userService.getUserById(id).subscribe(response => {
      this.updateUserData(response);
      this.cdr.detectChanges();
     });
  }

  updateUserData(userData: any): void {
    this.user = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      imageProfile: userData.ImageProfile,
      spaces: userData.spaces
    };
    this.cdr.detectChanges();
  }

  onUserUpdated(updatedUser: UserInterface): void {
    this.updateUserData(updatedUser);
  }
}