import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone:true,
  imports :[FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  spaceId: string = 'space1'; // L'espace dans lequel l'utilisateur se trouve
  userId: string = 'user1'; // ID de l'utilisateur
  message: string = '';
  messages: any[] = []; // Liste des messages reçus

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Rejoindre l'espace
    this.chatService.joinSpace(this.spaceId);

    // Recevoir les messages en temps réel
    this.chatService.receiveMessage((message) => {
      this.messages.push(message);
    });
  }

  // Fonction pour envoyer un message
  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.spaceId, this.userId, this.message);
      this.message = ''; // Réinitialiser le champ message après envoi
    }
  }
}
