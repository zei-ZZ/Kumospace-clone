import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private readonly room = 'defaultRoom'; 

  constructor() {
    this.socket = io('http://localhost:3000'); 

    this.socket.emit('joinRoom', this.room);
  }

  // Envoyer un message
  sendMessage(message: string) {
    this.socket.emit('sendMessage', message);
  }

  // Écouter les messages reçus
  onReceiveMessage(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (data: { message: string }) => {
        observer.next(data.message);
      });
    });
  }
}