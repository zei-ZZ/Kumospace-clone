import { Component, HostListener, signal } from '@angular/core';
import * as mapData from '../../assets/kumo.json';

@Component({
  selector: 'app-space',
  imports: [],
  templateUrl: './space.component.html',
  styleUrl: './space.component.css',
})
export class SpaceComponent {

  mapWidth = 1680;
  mapHeight = 1200;
  tileSize = 16;

  char = signal({ x: 200, y: 200 });
  viewportPosition = signal({ x: 0, y: 0 });

  collisionMap = signal<number[][]>([]);

  ngOnInit() {
    this.loadCollisionMap();
  }

  loadCollisionMap() {
    const collisionLayer = mapData.layers.find((layer: any) => layer.name === 'Collision');
    if (collisionLayer) {
      const flatData = collisionLayer.data;
      const binaryData = this.processCollisionLayer(flatData);
      this.collisionMap.set(this.convertTo2DArray(binaryData, mapData.width, mapData.height));
    }
  }

  /**
   * Convert raw collision layer data to binary
   * rawData = Flat array from the collision layer
   * result = Binary array (1 for obstacles, 0 for walkable areas)
   * Convert non-zero to 1
   */
  processCollisionLayer(rawData: number[]): number[] {
    return rawData.map((tile) => (tile === 0 ? 0 : 1)); 
  }

  /**
   * Convert a flat array to a 2D array
   * data = Binary flat array
   * width = Map width in tiles
   * height = Map height in tiles
   * result = 2D array representing the collision map
   */
  convertTo2DArray(data: number[], width: number, height: number): number[][] {
    const result: number[][] = [];
    for (let row = 0; row < height; row++) {
      const start = row * width;
      const end = start + width;
      result.push(data.slice(start, end));
    }
    return result;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const { x, y } = this.char();

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
    }
  }

  // Checking if the tile is walkable
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

  // Adjust the viewport to follow the character
  updateViewport(x: number, y: number) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const newViewportX = Math.max(0, Math.min(this.mapWidth - viewportWidth, x - viewportWidth / 2));
    const newViewportY = Math.max(0, Math.min(this.mapHeight - viewportHeight, y - viewportHeight / 2));

    this.viewportPosition.set({ x: newViewportX, y: newViewportY });
  }
}
