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

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  private spaceKeyPeerIdMap: Map<string, Set<string>> = new Map<
    string,
    Set<string>
  >();

  @WebSocketServer() server: Server;

  @SubscribeMessage('join-room')
  async handleSpaceJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { spaceKey: string; peerId: string },
  ) {
    const { spaceKey, peerId } = data;
    if (!this.spaceKeyPeerIdMap.has(spaceKey)) {
      this.spaceKeyPeerIdMap.set(spaceKey, new Set<string>());
    }

    this.server.to(spaceKey).emit('user-connected', peerId);

    await client.join(spaceKey);
    this.spaceKeyPeerIdMap.get(spaceKey)?.add(peerId);
  }

  @SubscribeMessage('disconnect')
  async handleSpaceLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { spaceKey: string; peerId: string },
  ) {
    const { spaceKey, peerId } = data;
    if (!this.spaceKeyPeerIdMap.get(spaceKey)) return 'Space does not exist';
    if (!this.spaceKeyPeerIdMap.get(spaceKey)?.has(peerId))
      return 'user not in space';
    await client.leave(spaceKey);
    this.spaceKeyPeerIdMap.get(spaceKey)?.delete(peerId);
    this.server.to(spaceKey).emit('user-disconnected', peerId);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug(
      `Number of connected clients: ${this.server.sockets.sockets.size}`,
    );
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }
}
