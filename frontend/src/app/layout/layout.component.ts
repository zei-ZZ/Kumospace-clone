import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit, OnDestroy {


  // Character's position (writable signals)
  charX = signal(0);
  charY = signal(0);

  // Map dimensions are dynamic so we need to calculate them
  private mapWidth = signal(this.calculateMapWidth());
  private mapHeight = signal(this.calculateMapHeight());

  /**
   * Map's position depending on character's position :
   *
   * Math.min(... , mapDimension - viewportSize) prevents
   * map from exposing its background by keeping the
   * bottom-right corner visible
   *
   * Math.max(0, ...) prevents map from moving into neg coords
   **/

  mapX = computed(() => {
    const maxMapX = Math.max(0, this.mapWidth() - window.innerWidth);
    return Math.min(
      Math.max(0, this.charX() - window.innerWidth / 2),
      maxMapX
    );
  });
  
  mapY = computed(() => {
    const maxMapY = Math.max(0, this.mapHeight() - window.innerHeight);
    return Math.min(
      Math.max(0, this.charY() - window.innerHeight / 2),
      maxMapY
    );
  });
  

  ngOnInit() {
    this.updateMapDimensions();
    window.addEventListener('resize', this.updateMapDimensions.bind(this));
    window.addEventListener('keydown', (event) => this.handleKeyPress(event));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateMapDimensions.bind(this));
    window.removeEventListener('keydown', this.handleKeyPress);
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

  moveCharacter(direction: 'up' | 'down' | 'left' | 'right') {
    const step = 30; // Movement speed (we'll adjust it later on)

    switch (direction) {
      /**
       * In CSS and the DOM, the coordinate system for positioning elements works differently than Cartesian system
       *  so moving up decreases y, moving down increases y, (x stays the same 😌)
       **/
      case 'up':
        this.charY.update((y) => Math.max(y - step, 0));
        break;
      case 'down':
        this.charY.update((y) =>
          Math.min(y + step, this.mapHeight() - this.characterSize())
        );
        break;
      case 'left':
        this.charX.update((x) => Math.max(x - step, 0));
        break;
      case 'right':
        this.charX.update((x) =>
          Math.min(x + step, this.mapWidth() - this.characterSize())
        );
        break;
    }
  }

  private calculateMapWidth(): number {
    const vw = window.innerWidth;
    if (vw >= 1000) {
      return vw * 1.2; // 120vw -> large screens
    } else if (vw >= 700) {
      return vw * 1.5; // 150vw -> medium screens
    } else {
      return vw * 1.8; // 180vw -> small screens
    }
  }

  private calculateMapHeight(): number {
    const vh = window.innerHeight;
    if (window.innerWidth >= 1000) {
      return vh * 1.2;
    } else if (window.innerWidth >= 700) {
      return vh * 1.5;
    } else {
      return vh * 1.8;
    }
  }

  private characterSize(): number {
    const vw = window.innerWidth;
    if (vw >= 1000) {
      return vw * 0.05; // 5vw -> large screens
    } else if (vw >= 700) {
      return vw * 0.08;
    } else {
      return vw * 0.1;
    }
  }

  private updateMapDimensions() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw >= 1000) {
      this.mapWidth.set(vw * 1.2); 
      this.mapHeight.set(vh * 1.2);
    } else if (vw >= 700) {
      this.mapWidth.set(vw * 1.5); 
      this.mapHeight.set(vh * 1.5); 
    } else {
      this.mapWidth.set(vw * 1.8); 
      this.mapHeight.set(vh * 1.8); 
    }
  
    console.log(
      `Map dimensions updated values after resizing screen are : Width = ${this.mapWidth()}, Height = ${this.mapHeight()}`
    );
  }
  
}
