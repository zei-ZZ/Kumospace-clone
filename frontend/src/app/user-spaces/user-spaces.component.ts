import { Component } from '@angular/core';
import { Space } from '../shared/models/space';

@Component({
  selector: 'app-user-spaces',
  imports: [],
  templateUrl: './user-spaces.component.html',
  styleUrl: './user-spaces.component.css'
})
export class UserSpacesComponent {
  spaces: Space[] = [];

  ngOnInit(): void {
    this.spaces = this.getDummySpaces();
    console.log(this.spaces);
  }

  getDummySpaces(): Space[] {
    return [
      {
        id: '1',
        name: 'Space 1',
        key: 'key1',
        capacity: 10,
        userId: 'user1'
      },
    ];
  }

}
