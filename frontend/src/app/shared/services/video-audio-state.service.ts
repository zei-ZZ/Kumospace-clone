import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoAudioStateService {

  videoEnabled = signal(true);

  toggleVideo() {
    this.videoEnabled.update((enabled) => !enabled);
  }
}
