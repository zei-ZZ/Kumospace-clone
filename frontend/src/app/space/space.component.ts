import { Component, HostListener, OnInit, OnDestroy, signal } from '@angular/core';
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
  private movementInterval!: ReturnType<typeof setInterval>;

  mapWidth = 1680;
  mapHeight = 1200;
  tileSize = 16;

  char = signal({ x: 200, y: 200 });
  viewportPosition = signal({ x: 0, y: 0 });
  collisionMap = signal<number[][]>([]);

  constructor(private readonly webSocketService: WebSocketService) {}

  ngOnInit() {
    this.webSocketService.connect();
    this.startSendingCoordinates();
    this.loadCollisionMap();
  }

  private startSendingCoordinates(): void {
    let lastSentCoordinates = this.char();
    this.movementInterval = setInterval(() => {
      const coordinates = this.char();
      if (coordinates.x !== lastSentCoordinates.x || coordinates.y !== lastSentCoordinates.y) {
        this.webSocketService.sendCoordinates(coordinates);
        lastSentCoordinates = coordinates;
      }
    }, 500); 
  }

  private loadCollisionMap() {
    const collisionLayer = (mapData as any).layers.find((layer: any) => layer.name === 'Collision');
    if (collisionLayer) {
      const binaryData = this.processCollisionLayer(collisionLayer.data);
      this.collisionMap.set(this.convertTo2DArray(binaryData, (mapData as any).width, (mapData as any).height));
    } else {
      console.warn('Collision layer not found in map data.');
    }
  }

  private processCollisionLayer(rawData: number[]): number[] {
    return rawData.map((tile) => (tile === 0 ? 0 : 1));
  }

  private convertTo2DArray(data: number[], width: number, height: number): number[][] {
    const result: number[][] = [];
    for (let row = 0; row < height; row++) {
      result.push(data.slice(row * width, (row + 1) * width));
    }
    return result;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const { x, y } = this.char();
    let newX = x;
    let newY = y;

    switch (event.key) {
      case 'ArrowUp': newY -= this.tileSize; break;
      case 'ArrowDown': newY += this.tileSize; break;
      case 'ArrowLeft': newX -= this.tileSize; break;
      case 'ArrowRight': newX += this.tileSize; break;
      default: return; // Ignore other keys
    }

    if (this.isWalkable(newX, newY)) {
      this.char.set({ x: newX, y: newY });
      this.updateViewport(newX, newY);
    }
  }

  private isWalkable(x: number, y: number): boolean {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    return (
      x >= 0 && y >= 0 &&
      x < this.mapWidth && y < this.mapHeight &&
      this.collisionMap()[tileY]?.[tileX] === 0
    );
  }

  private updateViewport(x: number, y: number) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    this.viewportPosition.set({
      x: Math.max(0, Math.min(this.mapWidth - viewportWidth, x - viewportWidth / 2)),
      y: Math.max(0, Math.min(this.mapHeight - viewportHeight, y - viewportHeight / 2))
    });
  }

  ngOnDestroy() {
    clearInterval(this.movementInterval);
    this.webSocketService.disconnect();
  }
}
