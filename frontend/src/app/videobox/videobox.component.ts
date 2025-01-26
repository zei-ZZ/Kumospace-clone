import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-videobox',
  imports: [],
  templateUrl: './videobox.component.html',
  styleUrl: './videobox.component.css'
})

export class VideoboxComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo', { static: true }) localVideo!: ElementRef<HTMLVideoElement>;
  private localStream: MediaStream | null = null;

  constructor() { }

  async ngOnInit() {
    await this.startLocalStream();
  }

  async startLocalStream() {
    try {
      // Get user media (video and audio)
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // Set the local stream as the source for the video element
      this.localVideo.nativeElement.srcObject = this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }
  ngOnDestroy() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
  }
}
