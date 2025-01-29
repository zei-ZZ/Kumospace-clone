import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
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
    private clientId =  "";
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
      this.clientId = client.id;
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.players.delete(client.id);
      this.broadcastNearbyAvatars();
    }
  
    
    @SubscribeMessage('playerMove')
    handlePlayerMovement(
      client: Socket,
      movement: { x: number; y: number }
    ): void {
  
      if (!client) {
        console.error('Client is undefined in handlePlayerMovement');
        return;
      }
  
      if (!movement) {
        console.error('Movement data is missing');
        return;
      }
  
      console.log(`Player ${client.id} moved to:`, movement);
      this.players.set(client.id, movement);
      this.broadcastNearbyAvatars();
    }
  

    private broadcastNearbyAvatars() {
      const allPlayers = Array.from(this.players.entries()).map(
        ([id, coordinates]) => ({ id, ...coordinates })
      );
  
      console.log('Broadcasting all player positions:', allPlayers);
      this.server.emit('nearbyAvatars', allPlayers);
    }
  }
  