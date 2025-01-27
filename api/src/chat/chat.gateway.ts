import { WebSocketGateway,
         SubscribeMessage,
         MessageBody, 
         OnGatewayInit,
         OnGatewayConnection,
         OnGatewayDisconnect,
         WebSocketServer 
        } from '@nestjs/websockets';
        
import { Server, Socket } from 'socket.io';

@WebSocketGateway()  //c'est notre  WebSocket Gateway
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Cette méthode est appelée lorsque le serveur WebSocket est initialisé
  afterInit() {
    console.log('Serveur WebSocket initialisé');
  }

  // Cette méthode est appelée lorsqu'un client se connecte
  handleConnection(client: Socket) {
    console.log(`Client connecté : ${client.id}`);
  }

  // Cette méthode est appelée lorsqu'un client se déconnecte
  handleDisconnect(client: Socket) {
    console.log(`Client déconnecté : ${client.id}`);
  }

  // Cette méthode reçoit les messages du client
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() message: string): void {
    console.log(`Message reçu: ${message}`);
    this.server.emit('receiveMessage', message);  // Émet à tous les clients connectés
  }
}
