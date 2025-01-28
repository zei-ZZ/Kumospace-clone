import {
  Component,
  HostListener,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { TileMapService } from '../shared/services/tile-map.service';
import * as mapData from '../../assets/kumo.json';
import Swal from 'sweetalert2';
import { UserAvatarComponent } from "../user-avatar/user-avatar.component";

@Component({
  selector: 'app-space',
  imports: [UserAvatarComponent],
  templateUrl: './space.component.html',
  styleUrl: './space.component.css',
})
export class SpaceComponent {
  private tileMapService = inject(TileMapService);

  mapWidth = 1680;
  mapHeight = 1200;
  tileSize = 16;

  char = signal({ x: 200, y: 200 });
  viewportPosition = signal({ x: 0, y: 0 });

  collisionMap = signal<number[][]>([]);
  doorMap = signal<number[][]>([]);

  ngOnInit() {
    this.loadMaps();
  }

  loadMaps() {
    this.loadLayer('Collision', this.collisionMap);
    this.loadLayer('Doors', this.doorMap);
  }

  private loadLayer(layerName: string, mapSignal: WritableSignal<number[][]>) {
    const layer = mapData.layers.find((l: any) => l.name === layerName);
    if (layer) {
      const flatData = layer.data;
      const binaryData = this.tileMapService.processLayer(flatData);
      mapSignal.set(
        this.tileMapService.convertTo2DArray(
          binaryData,
          mapData.width,
          mapData.height
        )
      );
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const { x, y } = this.char();
    const previousPosition = { x, y }; // To go back if needed

    let newX = x;
    let newY = y;

    switch (event.key) {
      case 'ArrowUp':
        newY -= this.tileSize;
        break;
      case 'ArrowDown':
        newY += this.tileSize;
        break;
      case 'ArrowLeft':
        newX -= this.tileSize;
        break;
      case 'ArrowRight':
        newX += this.tileSize;
        break;
    }

    if (this.isWalkable(newX, newY)) {
      this.char.set({ x: newX, y: newY });
      this.updateViewport(newX, newY);

      if (this.isAtDoor(newX, newY)) {
        Swal.fire({
          title: 'Do you want to enter this room?',
          text: "You'll get out of your current room!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: "Yes, let's GO!",
          cancelButtonText: 'No, stay here!',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // User confirmed: implement room entering logic here
            console.log('Entering the room...');
          } else {
            // User canceled: revert to previous position
            this.char.set(previousPosition); 
            this.updateViewport(previousPosition.x, previousPosition.y);
          }
        });
      }
    }
  }

  isWalkable(x: number, y: number): boolean {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    return (
      x >= 0 &&
      y >= 0 &&
      x < this.mapWidth &&
      y < this.mapHeight &&
      this.collisionMap()[tileY]?.[tileX] === 0
    );
  }

  isAtDoor(x: number, y: number): boolean {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    return this.doorMap()[tileY]?.[tileX] === 1;
  }

  updateViewport(x: number, y: number) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const newViewportX = Math.max(
      0,
      Math.min(this.mapWidth - viewportWidth, x - viewportWidth / 2)
    );
    const newViewportY = Math.max(
      0,
      Math.min(this.mapHeight - viewportHeight, y - viewportHeight / 2)
    );

    this.viewportPosition.set({ x: newViewportX, y: newViewportY });
  }
}
