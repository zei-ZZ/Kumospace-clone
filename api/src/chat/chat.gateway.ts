// src/chat/chat.gateway.ts

import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, WsResponse, ConnectedSocket } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3000, {
  cors: {
    origin: '*', // Permet d'accepter les connexions depuis n'importe quelle origine
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway');

  // Lorsqu'un utilisateur se connecte
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Lorsqu'un utilisateur se déconnecte
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Lorsqu'un utilisateur envoie un message
  @SubscribeMessage('chatMessage')
  handleChatMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): WsResponse<string> {
    this.logger.log(`Message from ${client.id}: ${message}`);
    return { event: 'chatMessage', data: message };
  }

  // Enregistrer un utilisateur
  @SubscribeMessage('register')
  handleRegister(@MessageBody() username: string, @ConnectedSocket() client: Socket) {
    client.data.username = username;  // Associe l'utilisateur au socket
    this.logger.log(`User registered: ${username}`);
  }
}
