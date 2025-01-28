import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowRightStartOnRectangle,
  heroChatBubbleLeftRight,
  heroMicrophone,
  heroVideoCamera,
  heroVideoCameraSlash,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css',
  imports: [NgIcon],
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
export class ToolboxComponent {}
