import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowRightStartOnRectangle,
  heroChatBubbleLeftRight,
  heroMicrophone,
  heroVideoCamera,
  heroVideoCameraSlash,
} from '@ng-icons/heroicons/outline';
import { ChatComponent } from"../chat/chat/chat.component";

import { VideoAudioStateService } from '../shared/services/video-audio-state.service';
import { Router } from '@angular/router';
import { STORAGE_KEYS } from '../shared/constants/storage-keys';
import { StorageService } from '../shared/services/storage.service';
import { ChatService } from '../shared/services/chat.service';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css',
  imports: [NgIcon, ChatComponent],
  standalone: true,
  viewProviders: [
    provideIcons({
      heroChatBubbleLeftRight,
      heroMicrophone,
      heroArrowRightStartOnRectangle,
      heroVideoCamera,
      heroVideoCameraSlash,
    }),
  ],
})
export class ToolboxComponent {

  private videoAudioStateService = inject(VideoAudioStateService);

  videoEnabled = this.videoAudioStateService.videoEnabled;
  isChatOpen: boolean = false;
  chatservice=inject(ChatService)

   router = inject(Router);
   storageservice=inject(StorageService)
 
   toggleChat() {
    this.chatservice.toggleChat();
  }
  LeaveMeeting(){

    const userId = this.storageservice.getItem(STORAGE_KEYS.USER_ID);
    if(userId){
      this.router.navigate([`userpage/${userId}`])
     }

  }

  toggleVideo() {
    this.videoAudioStateService.toggleVideo();
  }

}
