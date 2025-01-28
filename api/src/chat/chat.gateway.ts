import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) 

export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly room = 'defaultRoom';

  // Lorsqu'un client se connecte
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Rejoindre la room dès la connexion
    client.join(this.room);
    console.log(`Client ${client.id} joined room ${this.room}`);
  }

  // Lorsqu'un client se déconnecte
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Envoyer un message à la room
  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    this.server.to(this.room).emit('receiveMessage', { message });
    console.log(`Message sent to room ${this.room}: ${message}`);
  }
}