// chat.component.ts (Frontend)

import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone : true,
  imports :[FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Récupère les messages en temps réel
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  // Envoie le message
  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = ''; // Réinitialise le champ de message
    }
  }
}
