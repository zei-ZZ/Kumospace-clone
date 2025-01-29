import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { WebrtcService } from '../webrtc/webrtc.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-videobox',
  standalone: true,
  imports: [CommonModule, AsyncPipe, UserAvatarComponent],
  templateUrl: './videobox.component.html',
  styleUrls: ['./videobox.component.css'],
})
export class VideoboxComponent implements OnInit, OnDestroy {
  private webrtcService: WebrtcService = inject(WebrtcService);
  public peerId$: Observable<string>;
  public roomId: string;
  public remoteStreams$: Observable<{ [peerId: string]: MediaStream }>;
  public localStream: Observable<MediaStream | null> =
    this.webrtcService.getLocalStream();

  constructor() {
    this.webrtcService.setSpaceKey('room-default');
    this.webrtcService.initializeSocketAndPeerConnections();
    this.peerId$ = this.webrtcService.peerId$;
    this.roomId = this.webrtcService.spaceKey;
    this.remoteStreams$ = this.webrtcService.getRemoteStreams();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.webrtcService.ngOnDestroy();
  }
}
