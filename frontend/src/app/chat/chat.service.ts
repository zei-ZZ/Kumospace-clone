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
  sendMessage(spaceKey: string, message: string, sender: string) {
    this.socket.emit('sendMessage', { spaceKey, message, sender });
  }

  // Écouter les messages reçus
 // Écouter les messages reçus
 onReceiveMessage(): Observable<{ message: string; sender: string }> {
  return new Observable((observer) => {
    this.socket.on('receiveMessage', (data: { message: string; sender: string }) => {
      console.log('Message received:', data); // Log ici

      observer.next(data); // Retourne le message et le sender
    });
  });
}
}

