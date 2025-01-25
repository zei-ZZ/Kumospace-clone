import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto } from './dtos/createRoom.dto';
import { JoinRoomDto } from './dtos/joinRoom.dto';

@WebSocketGateway()
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SignalingGateway.name);
  rooms: Map<string, Set<string>> = new Map<string, Set<string>>();

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    const userId = client.id;
    if (!this.rooms[roomId]) {
      this.logger.log(`Room ${roomId} does not exist.`);
      client.emit('Room does not exist');
      return;
    }

    try {
      await client.join(roomId);
      this.rooms.get(roomId)?.add(userId);

      this.logger.debug(`Client ${userId} joined room ${data.roomId}`);

      this.server.to(roomId).emit('user-joined', userId);

      let usersInRoom = this.rooms.get(roomId);
      usersInRoom = usersInRoom
        ? new Set(Array.from(usersInRoom).filter((id) => id !== userId))
        : new Set<string>();

      client.emit('existing-users', usersInRoom);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage('create')
  async handleCreateRoom(
    @MessageBody() data: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    const userId = client.id;
    if (this.rooms.has(roomId)) {
      this.logger.log('Room already exists.');
      client.emit('Room already exists');
      return;
    }

    try {
      await client.join(roomId);
      this.rooms.get(roomId)?.add(userId);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    const userId = client.id;

    if (this.rooms[roomId]) {
      this.rooms.get(roomId)?.delete(userId);
      await client.leave(roomId);
      this.server.to(roomId).emit('user-left', userId);

      this.logger.log(`User ${userId} left room ${roomId}`);
    }
  }

  @SubscribeMessage('signal')
  handleSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; signal: object },
  ) {
    //Signal can be an SDP offer/answer or ICE candidate
    const { to: toRoomId, signal } = data;
    // Relay the signal to the target user
    this.rooms.get(toRoomId)?.forEach((userId) => {
      if (userId == client.id) return;
      client.to(userId).emit('signal', { from: client.id, signal: signal });
    });
    this.logger.log(`Relayed signal from ${client.id} to room ${toRoomId}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(
      `Number of connected clients: ${this.server.sockets.sockets.size}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
    this.rooms.forEach((usersId, roomId) => {
      if (usersId.has(client.id)) {
        usersId.delete(client.id);
        void client.leave(roomId);
        this.server.to(roomId).emit('user-left', client.id);
      }
    });
  }
}
