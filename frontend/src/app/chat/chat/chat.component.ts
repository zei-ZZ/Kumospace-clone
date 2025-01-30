import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [FormsModule],
})
export class ChatComponent implements OnInit {
  messages: { message: string; sender: string }[] = [];
  messageText: string = '';
  spaceKey: string = '';
  route: ActivatedRoute = inject(ActivatedRoute);
  initials: string = '';
  userName: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.spaceKey = this.route.snapshot.paramMap.get('spaceKey')!;
    this.chatService.joinRoom(this.spaceKey);
    this.extractUsernameFromToken();

    this.chatService
      .onReceiveMessage()
      .subscribe((data: { message: string; sender: string }) => {
        this.messages.push({ message: data.message, sender: data.sender });
      });
  }

  sendMessage(): void {
    if (this.messageText.trim()) {
      this.chatService.sendMessage(
        this.spaceKey,
        this.messageText,
        this.userName
      );
      console.log(this.userName);
      this.messageText = '';
    }
  }

  extractUsernameFromToken(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userName = decodedToken.username;
      this.initials = `${this.userName.charAt(0).toUpperCase()}`;
    }
  }

  getInitials(sender: string): string {
    return sender.charAt(0).toUpperCase();
  }
}
