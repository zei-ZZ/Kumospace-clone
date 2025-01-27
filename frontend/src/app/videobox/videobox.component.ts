import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import Peer, { MediaConnection } from 'peerjs';
import { io, Socket } from 'socket.io-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videobox',
  imports: [CommonModule],
  templateUrl: './videobox.component.html',
  styleUrls: ['./videobox.component.css']
})
export class VideoboxComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo', { static: true }) localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideos', { static: true }) remoteVideos!: ElementRef<HTMLDivElement>;

  private localStream: MediaStream | null = null;
  private remoteStreams: { [peerId: string]: MediaStream } = {};
  private peer: Peer;
  public peerId: string = "";
  public roomId: string = "default-room"; // Room ID for grouping peers
  private socket!: Socket;
  private peers: { [peerId: string]: MediaConnection } = {};
  constructor() {
    this.peer = new Peer();
  }

  ngOnInit(): void {
    this.initializePeer();
    this.connectToSocketServer();
  }

  initializePeer(): void {
    this.peer.on('open', (id) => {
      this.peerId = id;
      console.log('My peer ID is: ' + id);

      // Join the room
      this.socket.emit('join-room', this.roomId, this.peerId);
    });

    this.peer.on('call', (call) => {
      this.getUserMedia({ video: true, audio: true }, (stream) => {
        this.localStream = stream;
        this.localVideo.nativeElement.srcObject = stream;
        call.answer(stream); // Answer the call with the local stream

        call.on('stream', (remoteStream) => {
          this.remoteStreams[call.peer] = remoteStream;
          this.updateRemoteVideos();
        });
      }, (err) => {
        console.error('Failed to get local stream', err);
      });
    });
  }

  connectToSocketServer(): void {
    this.socket = io('http://localhost:3000'); // Socket.IO server URL

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    this.socket.on('user-connected', (remotePeerId: string) => {
      console.log('User connected:', remotePeerId);
      this.callPeer(remotePeerId);
    });

    this.socket.on('user-disconnected', (remotePeerId: string) => {
      console.log('User disconnected:', remotePeerId);
      this.removeRemoteVideo(remotePeerId);
    });
  }

  callPeer(remotePeerId: string): void {
    this.getUserMedia({ video: true, audio: true }, (stream) => {
      this.localStream = stream;
      this.localVideo.nativeElement.srcObject = stream;

      const call = this.peer.call(remotePeerId, stream);
      call.on('stream', (remoteStream) => {
        this.remoteStreams[remotePeerId] = remoteStream;
        this.updateRemoteVideos();
      });

      this.peers[remotePeerId] = call;
    }, (err) => {
      console.error('Failed to get local stream', err);
    });
  }

  getUserMedia(constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: Error) => void): void {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
    } else {
      console.error('getUserMedia is not supported in this browser');
    }
  }

  updateRemoteVideos(): void {
    const remoteVideosContainer = this.remoteVideos.nativeElement;
    remoteVideosContainer.innerHTML = ''; // Clear existing videos

    Object.keys(this.remoteStreams).forEach((peerId) => {
      const remoteStream = this.remoteStreams[peerId];
      const videoElement = document.createElement('video');
      videoElement.autoplay = true;
      videoElement.srcObject = remoteStream;
      remoteVideosContainer.appendChild(videoElement);
    });
  }

  removeRemoteVideo(peerId: string): void {
    if (this.remoteStreams[peerId]) {
      delete this.remoteStreams[peerId];
      this.updateRemoteVideos();
    }
  }


  ngOnDestroy(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    Object.values(this.peers).forEach((call) => call.close());
    this.socket.disconnect();
    this.peer.destroy();
  }
}