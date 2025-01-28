import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true, 
  imports: [FormsModule,CommonModule] 
})
export class ChatComponent {
  messages: string[] = []; 
  newMessage: string = ''; 

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages = [...this.messages, this.newMessage];  
      this.newMessage = '';
    }
  }
  
}
