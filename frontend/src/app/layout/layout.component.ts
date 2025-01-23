import { Component, Signal, signal, computed, effect, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit, OnDestroy{

  ngOnInit() {
    window.addEventListener('keydown', (event) => this.handleKeyPress(event));
  }

  private handleKeyPress(event: KeyboardEvent) {
    const keyMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    } as const;
  
    // I added this line due to TS strict typing that doesn't accept keyMap[event.key]
    const direction = keyMap[event.key as keyof typeof keyMap];
    
    if (direction) {
      this.moveCharacter(direction);
    }
  }

  // Character's position (writable signals)
  charX = signal(0);
  charY = signal(0);

  // Camera's position depending on character's position
  cameraX = computed(() => Math.max(0, this.charX() - window.innerWidth / 2));
  cameraY = computed(() => Math.max(0, this.charY() - window.innerHeight / 2));

  moveCharacter(direction: 'up' | 'down' | 'left' | 'right') {
    const step = 10; // Movement speed (we'll adjust it later on)

    switch (direction) {
      /**
       * In CSS and the DOM, the coordinate system for positioning elements works differently than Cartesian system
       *  so moving up decreases y, moving down increases y, (x stays the same 😌)
      **/
      case 'up': this.charY.update((y) => y - step); break; 
      case 'down': this.charY.update((y) => y + step); break;
      case 'left': this.charX.update((x) => x - step); break;
      case 'right': this.charX.update((x) => x + step); break;
    }
  }
  
  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

}
