import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports : [CommonModule,FormsModule]
})
export class ChatComponent implements OnInit {
  messages: { userId: string; message: string }[] = [];
  roomId: string = 'room1'; // Statique
  messageText: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Rejoindre une room à l'initialisation
    this.chatService.joinRoom(this.roomId);

    // Observer les messages
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.messageText) {
      this.chatService.sendMessage(this.roomId, this.messageText);
      this.messageText = ''; // Réinitialiser après l'envoi
    }
  }
}
