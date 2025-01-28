import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Activez CORS si nécessaire
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // Lorsqu'un client se connecte
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Lorsqu'un client se déconnecte
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Rejoindre une room basée sur le spaceKey
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() spaceKey: string,
  ) {
    // Rejoindre la room correspondant au spaceKey
    client.join(spaceKey);
    console.log(`Client ${client.id} joined room ${spaceKey}`);
  }

  // Envoyer un message à une room spécifique
  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { spaceKey: string; message: string; sender: string }, 
  ) {
    console.log('Payload received:', payload);

    const { spaceKey, message, sender } = payload;
    console.log("i m the sencer",sender)
    this.server.to(spaceKey).emit('receiveMessage', { message, sender }); 
    console.log(`Message sent to room ${spaceKey} by ${sender}: ${message}`);
  }
}