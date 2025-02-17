import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class SpaceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private players = new Map<string, { x: number; y: number }>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.players.delete(client.id);
    this.broadcastNearbyAvatars();
  }

  @SubscribeMessage('playerMove')
  handlePlayerMovement(
    @MessageBody() data: { peerId: string; position: { x: number; y: number } },
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('playerMoved', data);
  }

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  private broadcastNearbyAvatars() {
    const allPlayers = Array.from(this.players.entries()).map(
      ([id, coordinates]) => ({ id, ...coordinates }),
    );

    console.log('Broadcasting all player positions:', allPlayers);
    this.server.emit('nearbyAvatars', allPlayers);
  }
}
