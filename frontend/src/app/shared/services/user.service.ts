import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User, UserAuth, UserCredentials } from '../models/user';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environment';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;
  private http = inject(HttpClient);

  constructor() {
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

}
