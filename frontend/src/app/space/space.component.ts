import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import * as mapData from '../../assets/kumo.json';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { WebrtcService } from '../webrtc/webrtc.service';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../shared/services/websocket.service';

@Component({
  selector: 'app-space',
  imports: [UserAvatarComponent, CommonModule, AsyncPipe],
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css'],
})
export class SpaceComponent implements OnInit, OnDestroy {
  private movementInterval!: ReturnType<typeof setInterval>;

  private webSocketService = inject(WebSocketService);
  private webrtcService: WebrtcService = inject(WebrtcService);
  private route = inject(ActivatedRoute);
  public peerId$: Observable<string> = new Observable<string>();
  public remoteStreams$: Observable<{ [peerId: string]: MediaStream }> =
    new Observable<{ [peerId: string]: MediaStream }>();
  public localStream: Observable<MediaStream | null> =
    this.webrtcService.getLocalStream();
  private spaceKey!: string | null;

  ngOnInit(): void {
    this.webSocketService.connect();
    this.startSendingCoordinates();
    this.loadCollisionMap();

    this.spaceKey = this.route.snapshot.paramMap.get('spaceKey');

    this.webrtcService.setSpaceKey(String(this.spaceKey));
    this.webrtcService.initializeSocketAndPeerConnections();
    this.peerId$ = this.webrtcService.peerId$;
    this.remoteStreams$ = this.webrtcService.getRemoteStreams();
  }

  mapWidth = 1680;
  mapHeight = 1200;
  tileSize = 16;

  char = signal({ x: 200, y: 200 });
  viewportPosition = signal({ x: 0, y: 0 });
  collisionMap = signal<number[][]>([]);

  private startSendingCoordinates(): void {
    let lastSentCoordinates = this.char();
    this.movementInterval = setInterval(() => {
      const coordinates = this.char();
      if (
        coordinates.x !== lastSentCoordinates.x ||
        coordinates.y !== lastSentCoordinates.y
      ) {
        this.webSocketService.sendCoordinates(coordinates);
        lastSentCoordinates = coordinates;
      }
    }, 500);
  }

  loadCollisionMap() {
    const collisionLayer = mapData.layers.find(
      (layer: any) => layer.name === 'Collision'
    );
    if (collisionLayer) {
      const flatData = collisionLayer.data;
      const binaryData = this.processCollisionLayer(flatData);
      this.collisionMap.set(
        this.convertTo2DArray(binaryData, mapData.width, mapData.height)
      );
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

  private convertTo2DArray(
    data: number[],
    width: number,
    height: number
  ): number[][] {
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
      default:
        return;
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
      x >= 0 &&
      y >= 0 &&
      x < this.mapWidth &&
      y < this.mapHeight &&
      this.collisionMap()[tileY]?.[tileX] === 0
    );
  }

  private updateViewport(x: number, y: number) {
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
  }

  ngOnDestroy() {
    clearInterval(this.movementInterval);
    this.webSocketService.disconnect();
    this.webrtcService.ngOnDestroy();
  }
}
