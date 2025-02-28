import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private chatOpenSubject = new BehaviorSubject<boolean>(false);

  chatOpen$ = this.chatOpenSubject.asObservable(); 


  constructor() {
    this.socket = io(environment.apiUrl);
  }

  joinRoom(spaceKey: string) {
    this.socket.emit('join-chat', { spaceKey });
  }

  sendMessage(spaceKey: string, message: string, sender: string) {
    this.socket.emit('sendMessage', { spaceKey, message, sender });
  }

  onReceiveMessage(): Observable<{ message: string; sender: string }> {
    return new Observable((observer) => {
      this.socket.on(
        'receiveMessage',
        (data: { message: string; sender: string }) => {
          console.log('Message received:', data); 
          this.chatOpenSubject.next(true);
           observer.next(data); 
        }
      );
    });
  }

  toggleChat() {
    this.chatOpenSubject.next(!this.chatOpenSubject.value);
  }
}
