import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private messagesSubject: BehaviorSubject<{ userId: string, message: string }[]> = new BehaviorSubject<{ userId: string, message: string }[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000'); 

    // Réception des messages en temps réel
    this.socket.on('receiveMessage', (data: { userId: string, message: string }) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, data]);
    });
  }

  // Envoyer un message 
  sendMessage(userId: string, message: string): void {
    // Vérifie si l'ID utilisateur est valide
    if (userId !== '50fc50f3-43a4-44b6-9b92-20ad6ddb017b' && userId !== 'b3e219f3-47ec-45ba-a697-43b448b4e4a0') {
      console.error('Utilisateur inconnu');
      return;
    }
    this.socket.emit('sendMessage', { userId, message });
  }

  joinRoom(userId: string): void {
    if (userId === '50fc50f3-43a4-44b6-9b92-20ad6ddb017b' || userId === 'b3e219f3-47ec-45ba-a697-43b448b4e4a0') {
      this.socket.emit('joinRoom', userId);
    } else {
      console.error('Utilisateur inconnu');
    }
  }
}
