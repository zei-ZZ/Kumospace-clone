import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: Socket;

  connect() {
    this.socket = io('http://localhost:3000');
  }

  sendCoordinates(coordinates: { x: number; y: number }) {
    this.socket.emit('updateCoordinates', coordinates);
  }

  onNearbyAvatars(callback: (data: any) => void) {
    this.socket.on('nearbyAvatars', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
