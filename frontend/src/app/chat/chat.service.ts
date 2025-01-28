import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private messageSubject = new BehaviorSubject<{ userId: string; message: string }[]>([]);
  public messages$ = this.messageSubject.asObservable();


  constructor() {
    this.socket = io('http://localhost:3000');
  
    // Vérification de la connexion
  this.socket.on('connect', () => {
    console.log('Connected to the WebSocket server');
  });

  this.socket.on('message', (data: { userId: string; message: string }) => {
    console.log('Received message:', data); // Log pour vérifier si le message est bien reçu
    const currentMessages = this.messageSubject.value;
    this.messageSubject.next([...currentMessages, data]);
  });
  
  }

  // Rejoindre une room
  joinRoom(roomId: string): void {
    this.socket.emit('joinRoom', roomId);
  }

  // Quitter une room
  leaveRoom(roomId: string): void {
    this.socket.emit('leaveRoom', roomId);
  }

  // Envoyer un message dans une room
  sendMessage(roomId: string, message: string): void {
    this.socket.emit('sendMessage', { roomId, message });
  }

  // Envoyer un message à un utilisateur spécifique
  sendToUser(userId: string, message: string): void {
    this.socket.emit('sendToUser', { userId, message });
  }
}
