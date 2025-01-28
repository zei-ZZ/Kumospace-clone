import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor() {
    // Connectez-vous au serveur WebSocket
    this.socket = io('http://localhost:3000'); 
  }

  // Envoyer un message
  sendMessage(message: string): void {
    const userId = '123';
    this.socket.emit('sendMessage', { message, userId });
  }

  // Écouter les messages du serveur
  receiveMessage(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('receiveMessage', (data: { message: string }) => {
        observer.next(data.message); // Diffuse uniquement le contenu du message
      });
    });
  }
}
