import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports:[FormsModule,CommonModule]
})
export class ChatComponent implements OnInit {
  messages: { userId: string, message: string }[] = [];
  newMessage: string = '';
  userId: string = '50fc50f3-43a4-44b6-9b92-20ad6ddb017b'; 

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.joinRoom(this.userId);

    // Écouter les messages entrants
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.userId, this.newMessage);
      this.newMessage = ''; 
    }
  }
}
