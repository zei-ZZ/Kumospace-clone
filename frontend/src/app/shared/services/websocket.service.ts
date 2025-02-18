import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: Socket;
  private isConnected = false;

  // Signal for real-time position updates as a map (key = peerId, value = position)
  remotePositions = signal<Map<string, { x: number; y: number }>>(new Map());

  connect() {
    if (!this.socket || !this.isConnected) {
      this.socket = io(environment.apiUrl, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 5000,
      });
  
      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        this.isConnected = true;
      });
  
      this.socket.on('disconnect', () => {
        console.warn('WebSocket disconnected. Attempting to reconnect...');
        this.isConnected = false;
      });
  
      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });

      this.socket.on('playerMoved', (data: { peerId: string; position: { x: number; y: number } }) => {
        console.log('Received position update:', data);
        const currentPositions = this.remotePositions();
        currentPositions.set(data.peerId, data.position);
        this.remotePositions.set(new Map(currentPositions));
      });
    }
  }
  
  sendCoordinates(coordinates: { x: number; y: number }, peerId: string) {
    if (this.isConnected && this.socket) {
      const data = {
        peerId,
        position: coordinates
      };
      this.socket.emit('playerMove', data); 
      console.log('Sending position update:', data);
    } else {
      console.warn('Socket is not connected. Cannot send coordinates.');
    }
  }
  
  onNearbyAvatars(callback: (data: any) => void) {
    this.socket.on('nearbyAvatars', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }
}
