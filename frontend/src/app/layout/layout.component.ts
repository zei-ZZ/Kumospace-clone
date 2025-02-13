import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SpaceComponent } from '../space/space.component';
import { ToolboxComponent } from '../toolbox/toolbox.component';
import { ActivatedRoute } from '@angular/router';
import { SpaceService } from '../shared/services/space.service';
import { catchError, of, Subscription, tap } from 'rxjs';
import { Space } from '../shared/models/space';
import { ChatService } from '../shared/services/chat.service';
import { ChatComponent } from "../chat/chat/chat.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [SpaceComponent, ToolboxComponent, ChatComponent,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit,OnDestroy{
  spaceKey: string | null = null;
  route: ActivatedRoute = inject(ActivatedRoute);
  spaceService = inject(SpaceService);
  chatservice=inject(ChatService);

  space: Space = new Space();
  messages: { message: string; sender: string }[] = [];
  chatOpen$ = this.chatservice.chatOpen$; 
  messageSubscription:Subscription | null = null;


  ngOnInit(): void {
    this.spaceKey = this.route.snapshot.paramMap.get('spaceKey');
    this.getSpaceByKey();
    if(this.spaceKey){
      this.chatservice.joinRoom(this.spaceKey);
    }
    this.messageSubscription=this.chatservice
      .onReceiveMessage()
      .subscribe((data: { message: string; sender: string }) => {
        this.messages.push({ message: data.message, sender: data.sender });
      });
}

ngOnDestroy(): void {
  if (this.messageSubscription) {
    this.messageSubscription.unsubscribe();
  }
}

  getSpaceByKey(): void {
    if (this.spaceKey) {
      this.spaceService
        .getSpaceByKey(this.spaceKey)
        .pipe(
          tap((response) => {
            this.space = {
              id: response.id,
              name: response.name,
              key: response.key,
              capacity: response.capacity,
              userId: response.user.id,
            };
          }),
          catchError((error) => {
            console.error('Error fetching space by key:', error);
            return of(null);
          })
        )
        .subscribe();
    }
  }
}
