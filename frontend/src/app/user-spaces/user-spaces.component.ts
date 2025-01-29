import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Space } from '../shared/models/space';
import { UserDto } from '../shared/models/user';
import { SpaceService } from '../shared/services/space.service';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-spaces',
  imports: [],
  templateUrl: './user-spaces.component.html',
  styleUrl: './user-spaces.component.css'
})
export class UserSpacesComponent {
  @Input() user!: UserDto;
  spaces: Space[] = [];
  spaceService = inject(SpaceService);
  router = inject(Router);


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && changes['user'].currentValue) {
      const user = changes['user'].currentValue;
      this.fetchSpacesByUser(user.id);
    }
  }
  
  fetchSpacesByUser(userId: string): void {
    this.spaceService.getSpacesByUser(userId).pipe(
      tap(response => {
         this.spaces = response.map((space: Space) => ({
          id: space.id,
          name: space.name,
          key: space.key,
          capacity: space.capacity,
          userId: this.user.id
        }));
      }),
      catchError(error => {
        console.error('Error fetching spaces by user:', error);
        return of([]);
      })
    ).subscribe();
  }

  navigateToSpace(spaceKey: string): void {
    this.router.navigate(['/layout', spaceKey]);
  }

  copySpaceKey(event: Event, key: string): void {
    event.stopPropagation();
    navigator.clipboard.writeText(key).then(() => {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Space key copied to clipboard!',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
}
