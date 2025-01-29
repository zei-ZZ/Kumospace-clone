import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:4200', // Frontend URL
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
  
    // Listen for 'playerMove' event
    @SubscribeMessage('playerMove')
    handlePlayerMovement(
      client: Socket,
      @MessageBody() movement: { x: number; y: number }
    ): void {
      console.log('Client:', client);  // Logs client object to check if it's defined
  
      if (!client) {
        console.error('❗ Client is undefined in handlePlayerMovement');
        return;
      }
  
      if (!movement) {
        console.error('❗ Movement data is missing');
        return;
      }
  
      console.log(`Player ${client.id} moved to:`, movement);
  
      // Update player position in the map
      this.players.set(client.id, movement);
  
      // Broadcast the updated player positions to all clients
      this.broadcastNearbyAvatars();
    }
  
    // Broadcast the positions of all players to every connected client
    private broadcastNearbyAvatars() {
      // Create a list of all player positions
      const allPlayers = Array.from(this.players.entries()).map(
        ([id, coordinates]) => ({ id, ...coordinates })
      );
  
      console.log('Broadcasting all player positions:', allPlayers);
  
      // Emit the list of all players and their positions to all connected clients
      this.server.emit('nearbyAvatars', allPlayers);
    }
  }
  