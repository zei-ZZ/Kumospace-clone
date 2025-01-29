import { Injectable } from '@angular/core';
import Peer, { MediaConnection } from 'peerjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService {
  private peer!: Peer;
  private socket!: Socket;
  private localStreamSubject = new BehaviorSubject<MediaStream | null>(null);
  private remoteStreamsSubject = new BehaviorSubject<{
    [peerId: string]: MediaStream;
  }>({});
  private peers: { [peerId: string]: MediaConnection } = {};

  public peerId$ = new BehaviorSubject<string>('');
  public spaceKey = '';

  setSpaceKey(spaceKey: string) {
    this.spaceKey = spaceKey;
  }

  initializeSocketAndPeerConnections() {
    this.getUserMedia({ video: true, audio: true }).then((stream) => {
      this.localStreamSubject.next(stream);
    });

    this.peer! = new Peer();
    this.initializePeer();
    this.connectToSocketServer();
  }
  private initializePeer(): void {
    this.peer!.on('open', (id) => {
      this.peerId$.next(id);
      this.socket.emit('join-room', { spaceKey: this.spaceKey, peerId: id });
    });

    this.peer!.on('call', (call) => {
      //IMPROVEMENT: We can change this to configure permissions
      this.getUserMedia({ video: true, audio: true }).then((stream) => {
        // this.localStreamSubject.next(stream);
        call.answer(stream);

        call.on('stream', (remoteStream) => {
          const remoteStreams = this.remoteStreamsSubject.value;
          remoteStreams[call.peer] = remoteStream;
          this.remoteStreamsSubject.next(remoteStreams);
        });
      });
    });
  }

  private connectToSocketServer(): void {
    this.socket = io(environment.apiUrl);

    this.socket.on('user-connected', (remotePeerId: string) => {
      this.callPeer(remotePeerId);
    });

    this.socket.on('user-disconnected', (remotePeerId: string) => {
      const remoteStreams = this.remoteStreamsSubject.value;
      delete remoteStreams[remotePeerId];
      this.remoteStreamsSubject.next(remoteStreams);
    });
  }

  public callPeer(remotePeerId: string): void {
    this.getUserMedia({ video: true, audio: true }).then((stream) => {
      // this.localStreamSubject.next(stream);

      const call = this.peer!.call(remotePeerId, stream);
      call.on('stream', (remoteStream) => {
        const remoteStreams = this.remoteStreamsSubject.value;
        remoteStreams[remotePeerId] = remoteStream;
        this.remoteStreamsSubject.next(remoteStreams);
      });

      this.peers[remotePeerId] = call;
    });
  }

  private getUserMedia(
    constraints: MediaStreamConstraints
  ): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  public getLocalStream(): Observable<MediaStream | null> {
    return this.localStreamSubject.asObservable();
  }

  public getRemoteStreams(): Observable<{ [peerId: string]: MediaStream }> {
    return this.remoteStreamsSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.localStreamSubject.value?.getTracks().forEach((track) => track.stop());
    Object.values(this.peers).forEach((call) => call.close());
    this.socket.disconnect();
    this.peer!.destroy();
  }
}
