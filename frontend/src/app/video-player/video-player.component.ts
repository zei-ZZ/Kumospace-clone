import { Component, input } from '@angular/core';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent {
  stream = input<MediaStream | null>(null);
  muted = input<boolean>(false);
}
