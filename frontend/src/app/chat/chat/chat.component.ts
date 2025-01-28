import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports:[FormsModule,CommonModule]
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  messageText: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Écouter les messages reçus depuis les clients (sokcets) qui sont dans la meme room
    this.chatService.onReceiveMessage().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  // Envoyer un message
  sendMessage(): void {
    if (this.messageText.trim()) {
      this.chatService.sendMessage(this.messageText);
      this.messageText = '';
    }
  }
}