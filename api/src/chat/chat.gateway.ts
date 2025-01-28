import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "*", // CORS pour permettre les connexions depuis n'importe quelle origine
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  private static readonly userIds = [
    '50fc50f3-43a4-44b6-9b92-20ad6ddb017b',
    'b3e219f3-47ec-45ba-a697-43b448b4e4a0',
  ];

  private users = new Map(); 

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: { userId: string, message: string }, @ConnectedSocket() socket: Socket): void {
    const { userId, message } = data;
    
    // Vérifie si l'ID utilisateur est valide 
    if (!ChatGateway.userIds.includes(userId)) {
      socket.emit('error', 'Utilisateur inconnu');
      return;
    }

    // Envoie le message à tous les autres utilisateurs sauf celui qui l'a envoyé
    socket.broadcast.emit('receiveMessage', { userId, message });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() socket: Socket): void {
    // Vérifie si l'ID utilisateur est valide
    if (!ChatGateway.userIds.includes(userId)) {
      socket.emit('error', 'Utilisateur inconnu');
      return;
    }

    this.users.set(userId, socket);
    socket.join(userId); // Le client rejoint la "room" correspondant à son ID utilisateur
  }
}
