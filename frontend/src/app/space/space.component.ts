import {
  Component,
  HostListener,
  signal,
  inject,
  OnDestroy,
  OnInit,
  WritableSignal,
  computed,
} from '@angular/core';
import * as mapData from '../../assets/kumo.json';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { WebrtcService } from '../webrtc/webrtc.service';
import { ActivatedRoute } from '@angular/router';
import { TileMapService } from '../shared/services/tile-map.service';
import * as roomsMap from '../../assets/roomsMatrix.json';
import Swal from 'sweetalert2';
import { WebSocketService } from '../shared/services/websocket.service';

interface RemoteUser {
  stream: MediaStream;
  position: { x: number; y: number };
}
@Component({
  selector: 'app-space',
  imports: [UserAvatarComponent, CommonModule, AsyncPipe],
  templateUrl: './space.component.html',
  styleUrl: './space.component.css',
})
export class SpaceComponent implements OnInit, OnDestroy {
  private tileMapService = inject(TileMapService);
  private webrtcService: WebrtcService = inject(WebrtcService);
  private webSocketService = inject(WebSocketService);
  private route = inject(ActivatedRoute);

  //public peerId$: Observable<string> = new Observable<string>();
 
  private spaceKey!: string | null;

  public peerId$ = signal<string>('');
  public remoteStreams$: Observable<{ [peerId: string]: MediaStream }> =
    new Observable<{ [peerId: string]: MediaStream }>();
  public localStream: Observable<MediaStream | null> =
    this.webrtcService.getLocalStream();

  remotePositions = computed(() => this.webSocketService.remotePositions());

  ngOnInit(): void {
    this.loadMaps();
    this.spaceKey = this.route.snapshot.paramMap.get('spaceKey');

    this.webrtcService.setSpaceKey(String(this.spaceKey));
    this.webrtcService.initializeSocketAndPeerConnections();

    // Initialize WebSocket connection
    this.webSocketService.connect();

    // Subscribe to peer ID changes
    this.webrtcService.peerId$.subscribe((peerId) => {
      this.peerId$.set(peerId);
    });

    this.remoteStreams$ = this.webrtcService.getRemoteStreams();
  }

  mapWidth = 1680;
  mapHeight = 1200;
  tileSize = 16;

  char = signal({ x: 200, y: 200 });
  viewportPosition = signal({ x: 0, y: 0 });

  collisionMap = signal<number[][]>([]);
  doorMap = signal<number[][]>([]);
  private roomsMatrix: string[][] = roomsMap.map;

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

      this.webSocketService.sendCoordinates({ x: newX, y: newY },
        this.peerId$());

      if (this.isAtDoor(newX, newY)) {
        // hack :P
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
            console.log(previousPosition);
            console.log(newX, newY);

            console.log(
              `Moving from room ${
                this.roomsMatrix[
                  Math.floor(previousPosition.y / this.tileSize)
                ][Math.floor(previousPosition.x / this.tileSize)]
              } to room ${
                this.roomsMatrix[Math.floor(newY / this.tileSize)][
                  Math.floor(newX / this.tileSize)
                ]
              }`
            );
            // make websoccket call here
          } else {
            // User canceled: revert to previous position
            this.char.set(previousPosition);
            this.updateViewport(previousPosition.x, previousPosition.y);
            this.webSocketService.sendCoordinates(previousPosition, this.peerId$());
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

  ngOnDestroy(): void {
    this.webrtcService.ngOnDestroy();
    this.webSocketService.disconnect();
  }
}
