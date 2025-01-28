import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  messageText: string = '';
  spaceKey: string='';
  route: ActivatedRoute = inject(ActivatedRoute);
   
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.spaceKey = this.route.snapshot.paramMap.get('spaceKey')!;
    console.log("i m rour space key",this.spaceKey)

    this.chatService.joinRoom(this.spaceKey);
  
    this.chatService.onReceiveMessage().subscribe((message: string) => {
      this.messages.push(message); 
    });
  }
  sendMessage(): void {
    if (this.messageText.trim()) {
      this.chatService.sendMessage(this.spaceKey, this.messageText);
      this.messageText = '';
    }
  }
}


