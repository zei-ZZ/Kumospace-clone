import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { SpaceDto } from '../models/space';


@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private apiUrl = `${environment.apiUrl}/space`;

  constructor(private http: HttpClient) {}

  createSpace(space: SpaceDto, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { space, userId });
  }

  getSpaceByKey(key: string): Observable<any> {
    return this.http.get<SpaceDto>(`${this.apiUrl}/key/${key}`);
  }
}