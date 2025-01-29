import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TileMapService {
  processLayer(rawData: number[]): number[] {
    return rawData.map((tile) => (tile === 0 ? 0 : 1));
  }

  convertTo2DArray(data: number[], width: number, height: number): number[][] {
    const result: number[][] = [];
    for (let row = 0; row < height; row++) {
      const start = row * width;
      const end = start + width;
      result.push(data.slice(start, end));
    }
    return result;
  }
}
