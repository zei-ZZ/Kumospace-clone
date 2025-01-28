import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserDto } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';
import { catchError, firstValueFrom, Observable, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { SpaceService } from '../shared/services/space.service';
import { SpaceDto } from '../shared/models/space';
import { showCreateSpacePopup } from '../shared/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userService = inject(UserService);
  spaceService = inject(SpaceService);
  router = inject(Router);

  @Input() user!: UserDto;
  @Output() userUpdated = new EventEmitter<UserDto>();


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

  createSpace(): void {
    showCreateSpacePopup().then(formValues => {
      if (formValues) {
        const [name, capacity] = formValues;
        const space: SpaceDto = { name, capacity: parseInt(capacity, 10) };
        this.submitCreateSpace(space).subscribe();
      }
    });
  }

  private submitCreateSpace(space: SpaceDto): Observable<void | null> {
    return this.spaceService.createSpace(space, this.user.id).pipe(
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Space Created',
          text: 'The space has been created successfully!',
        });
        this.router.navigate([`/layout/${response.key}`]);
      }),
      catchError(error => {
        console.error('Error creating space:', error);
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: 'There was an error creating the space. Please try again.',
        });
        return of(null);
      })
    );
  }
}
