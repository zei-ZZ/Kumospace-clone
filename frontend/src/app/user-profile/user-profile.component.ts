import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserDto } from '../shared/models/user';
import { UserService } from '../shared/services/user.service';
import { catchError, firstValueFrom, Observable, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { SpaceService } from '../shared/services/space.service';
import { SpaceDto } from '../shared/models/space';
import { showCreateSpacePopup, showJoinSpacePopup } from '../shared/utils';
import { Router } from '@angular/router';
import { heroArrowRightStartOnRectangle } from '@ng-icons/heroicons/outline';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [NgIcon,CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css', viewProviders: [
      provideIcons({
        heroArrowRightStartOnRectangle,
      }),
    ],
})
export class UserProfileComponent {
  userService = inject(UserService);
  spaceService = inject(SpaceService);
  authservice=inject(AuthService)
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

  joinWithKey(): void {
    showJoinSpacePopup().then(key => {
      if (key) {
        this.spaceService.getSpaceByKey(key).pipe(
          tap(space => {
            if (space) {
              this.router.navigate([`/layout/${key}`]);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Space Not Found',
                text: 'No space found with the provided key.',
              });
            }
          }),
          catchError(error => {
            console.error('Error fetching space:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error fetching the space. Please try again.',
            });
            return of(null);
          })
        ).subscribe();
      }
    });
  }
  logout():void{
    this.authservice.logout();
    this.router.navigate(['auth']);
}
}
