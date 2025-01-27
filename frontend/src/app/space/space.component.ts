import {
  Component,
  signal,
  WritableSignal,
  computed,
  HostListener,
} from '@angular/core';
import mapData from '../../assets/map.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-space',
  imports: [CommonModule],
  templateUrl: './space.component.html',
  styleUrl: './space.component.css',
})
export class SpaceComponent {
  map: number[][] = mapData.tiles; // Map loaded from JSON
  tileSize: number = mapData.tileSize;

  characterPosition: WritableSignal<{ x: number; y: number }> = signal({ x: 1, y: 1 }); // Grid-based position

  screenSize = signal({ width: window.innerWidth, height: window.innerHeight });

  positionSignal = computed(() => {
    const { x, y } = this.characterPosition();
    const { width, height } = this.screenSize();
    return `translate(${-x * this.tileSize + width / 2}px, ${-y * this.tileSize + height / 2}px)`;
  });

  ngOnInit(): void {
    window.addEventListener('resize', this.updateScreenSize.bind(this));
  }

  updateScreenSize() {
    this.screenSize.set({ width: window.innerWidth, height: window.innerHeight });
  }

  @HostListener('window:keydown', ['$event'])
  moveCharacter(event: KeyboardEvent) {
    const { x, y } = this.characterPosition();
    let newX = x;
    let newY = y;

    switch (event.key) {
      case 'ArrowUp':
        newY--;
        break;
      case 'ArrowDown':
        newY++;
        break;
      case 'ArrowLeft':
        newX--;
        break;
      case 'ArrowRight':
        newX++;
        break;
    }

    if (this.canMove(newX, newY)) {
      this.characterPosition.set({ x: newX, y: newY });
    }
  }

  canMove(x: number, y: number): boolean {
    return this.map[y]?.[x] === 0; // Check if the tile is walkable
  }
}
