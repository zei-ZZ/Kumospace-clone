

import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: any;
  private messagesSubject = new BehaviorSubject<string[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    // Crée une connexion avec le serveur WebSocket
    this.socket = io('http://localhost:3000');
    
    // Écoute des nouveaux messages
    this.socket.on('chatMessage', (message: string) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });
  }

  // Envoie un message au serveur
  sendMessage(message: string): void {
    this.socket.emit('chatMessage', message);
  }
}

