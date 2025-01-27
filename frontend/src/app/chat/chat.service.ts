import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor() {
    // Connecter le client au serveur WebSocket
    this.socket = io('http://localhost:3000');
  }

  // Rejoindre un espace spécifique 
  joinSpace(spaceId: string): void {
    spaceId='916de4cb-4db4-4225-acf2-c5f570237f66'
    this.socket.emit('joinSpace', spaceId);
  }

  // Envoyer un message dans un espace
  sendMessage(spaceId: string, userId: string, message: string): void {
    this.socket.emit('sendMessage', { message, spaceId, userId });
  }

  // Recevoir un message d'un espace
  receiveMessage(callback: (message: any) => void): void {
    this.socket.on('receiveMessage', (message) => {
      callback(message);
    });
  }
}
