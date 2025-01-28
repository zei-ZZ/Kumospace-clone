import { Component, HostListener, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapData from '../../assets/kumo.json';
import { WebSocketService } from './websocket.service';

@Component({
  selector: 'app-space',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css'],
})
export class SpaceComponent implements OnInit, OnDestroy {
  private movementInterval: any;

  mapWidth = 1680;
  mapHeight = 1200;
  tileSize = 16;

  char = signal({ x: 200, y: 200 });
  viewportPosition = signal({ x: 0, y: 0 });
  collisionMap = signal<number[][]>([]);

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.webSocketService.connect();
    this.startSendingCoordinates();
    this.loadCollisionMap();
  }

  private startSendingCoordinates(): void {
    this.movementInterval = setInterval(() => {
      const coordinates = this.char();
      this.webSocketService.sendCoordinates(coordinates);
    }, 500); // Update every 500ms
  }

  loadCollisionMap() {
    const collisionLayer = mapData.layers.find((layer: any) => layer.name === 'Collision');
    if (collisionLayer) {
      const flatData = collisionLayer.data;
      const binaryData = this.processCollisionLayer(flatData);
      this.collisionMap.set(this.convertTo2DArray(binaryData, mapData.width, mapData.height));
    }
  }

  processCollisionLayer(rawData: number[]): number[] {
    return rawData.map((tile) => (tile === 0 ? 0 : 1));
  }

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

  updateViewport(x: number, y: number) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const newViewportX = Math.max(0, Math.min(this.mapWidth - viewportWidth, x - viewportWidth / 2));
    const newViewportY = Math.max(0, Math.min(this.mapHeight - viewportHeight, y - viewportHeight / 2));

    this.viewportPosition.set({ x: newViewportX, y: newViewportY });
  }

  ngOnDestroy() {
    clearInterval(this.movementInterval);
    this.webSocketService.disconnect();
  }
}
