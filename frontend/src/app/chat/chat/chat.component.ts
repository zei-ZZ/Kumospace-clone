import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  messageText: string = '';
  spaceKey: string = 'ec7e4ac7-c784-40f8-95ea-958e58700b69';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.joinRoom(this.spaceKey);
  
    this.chatService.onReceiveMessage().subscribe((message: string) => {
      this.messages.push(message); // Ajoutez directement la chaîne de caractères
    });
  }
  sendMessage(): void {
    if (this.messageText.trim()) {
      this.chatService.sendMessage(this.spaceKey, this.messageText);
      this.messageText = '';
    }
  }
}


