import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserInterface } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userService = inject(UserService);
  @Input() user!: UserInterface;
  @Output() userUpdated = new EventEmitter<UserInterface>();


  getProfileImageUrl(): string {
    return this.userService.getProfileImageUrl(this.user);
  }

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('photo', file);
      await firstValueFrom(this.userService.uploadProfilePhoto(formData));
      const updatedUser = await firstValueFrom(this.userService.getUserById(this.user.id));
      if (updatedUser) {
        this.userUpdated.emit(updatedUser);
        Swal.fire({
          icon: 'success',
          title: 'Upload Successful',
          text: 'Your profile photo has been updated successfully!',
        });
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'There was an error uploading your profile photo. Please try again.',
      });
    }
  }
}
