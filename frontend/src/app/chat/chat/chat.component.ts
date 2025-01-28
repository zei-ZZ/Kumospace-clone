import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import  {jwtDecode} from 'jwt-decode';



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
  initials: string="";
  userName: string="";
   
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {

    this.spaceKey = this.route.snapshot.paramMap.get('spaceKey')!;
    console.log("i m rour space key",this.spaceKey)

    this.chatService.joinRoom(this.spaceKey);
    this.extractUsernameFromToken()
  
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
  extractUsernameFromToken(): void {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      const decodedToken: any = jwtDecode(token); // Décoder le token
      this.userName = decodedToken.username; // Extraire username
      console.log(this.userName)
    }
  
      this.initials = `${this.userName.charAt(0).toUpperCase()}`;
    }
  

  getInitials(): string {
    return this.initials;
  }
}



