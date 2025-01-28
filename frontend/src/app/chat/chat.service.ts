import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); 
  }

  // Rejoindre une room basée sur le spaceKey
  joinRoom(spaceKey: string) {
    this.socket.emit('joinRoom', spaceKey);
  }

  // Envoyer un message à une room spécifique
  sendMessage(spaceKey: string, message: string) {
    this.socket.emit('sendMessage', { spaceKey, message });
  }

  // Écouter les messages reçus
  onReceiveMessage(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (data: { message: string }) => {
        observer.next(data.message); // Retourne uniquement la chaîne de caractères
      });
    });
  }
}
