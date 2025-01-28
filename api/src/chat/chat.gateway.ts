import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "*", 
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, Socket>();

  // Méthode appelée lors de la connexion
  handleConnection(client: Socket) {
    console.log(`User connected: ${client.id}`);
    this.users.set(client.id, client);
  }

  // Méthode appelée lors de la déconnexion
  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
    this.users.delete(client.id);
  }

  // Méthode pour rejoindre une room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string): void {
    console.log(`${client.id} joining room: ${roomId}`);
    client.join(roomId);
    this.server.to(roomId).emit('message', `${client.id} a rejoint la room ${roomId}`);
  }

  // Méthode pour envoyer un message dans une room
  @SubscribeMessage('sendMessage')
handleMessage(client: Socket, payload: { roomId: string, message: string }): void {
  console.log('Message received:', payload); // Ajouter ce log pour vérifier
  this.server.to(payload.roomId).emit('message', {
    userId: client.id,
    message: payload.message,
  });
}


  // Méthode pour quitter une room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomId: string): void {
    console.log(`${client.id} leaving room: ${roomId}`);
    client.leave(roomId);
    this.server.to(roomId).emit('message', `${client.id} a quitté la room ${roomId}`);
  }

  // Méthode pour envoyer un message à un utilisateur spécifique
  @SubscribeMessage('sendToUser')
  handleSendToUser(client: Socket, payload: { userId: string, message: string }) {
    const targetClient = this.users.get(payload.userId);
    if (targetClient) {
      targetClient.emit('message', {
        userId: client.id,
        message: payload.message,
      });
    }
  }

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }
}
