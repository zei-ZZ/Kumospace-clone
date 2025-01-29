import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: Socket;
  private isConnected = false;

  connect() {
    if (!this.socket || !this.isConnected) {
      this.socket = io('http://localhost:3000', {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 5000,
      });
  
      this.socket.on('connect', () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
      });
  
      this.socket.on('disconnect', () => {
        console.warn('❌ WebSocket disconnected. Attempting to reconnect...');
        this.isConnected = false;
      });
  
      this.socket.on('connect_error', (error) => {
        console.error('❗ WebSocket connection error:', error);
      });
    }
  }
  
  sendCoordinates(coordinates: { x: number; y: number }) {
    if (this.isConnected && this.socket) {
      this.socket.emit('playerMove', coordinates); // Ensure this event name matches the backend
      console.log(coordinates);
    } else {
      console.warn('⚠️ Socket is not connected. Cannot send coordinates.');
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
