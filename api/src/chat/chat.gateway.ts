import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Permettre le CORS pour Angular
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Gère les connexions des utilisateurs
  handleConnection(client: Socket) {
    console.log(`User connected: ${client.id}`);
  }

  // Gère les déconnexions des utilisateurs
  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
  }

  // Recevoir les messages des utilisateurs
  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { username: string; message: string }) {
    console.log(`Message from ${payload.username}: ${payload.message}`);
    // Diffuser le message à tous les clients
    this.server.emit('receiveMessage', payload);
  }
}
