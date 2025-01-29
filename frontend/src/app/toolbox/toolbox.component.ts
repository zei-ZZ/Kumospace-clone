import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowRightStartOnRectangle,
  heroChatBubbleLeftRight,
  heroMicrophone,
  heroVideoCamera,
  heroVideoCameraSlash,
} from '@ng-icons/heroicons/outline';
import { ChatComponent } from"../chat/chat/chat.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css',
  imports: [NgIcon, ChatComponent,CommonModule],
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
  isChatOpen: boolean = false;

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

}
