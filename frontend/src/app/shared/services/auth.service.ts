import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User, UserAuth, UserCredentials } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/user`;
  isAuthenticated = signal<UserAuth | undefined | null>(undefined);
  private storageService = inject(StorageService);
  private http = inject(HttpClient);

  constructor() {
    this.checkInitialAuth();
  }

   private checkInitialAuth() {
    const userId = this.storageService.getItem(STORAGE_KEYS.USER_ID);
    const token = this.storageService.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (userId && token) {
      this.isAuthenticated.set({
        id: userId,
        token: token
      });
    }
  }

  register(userData: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: UserCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }
}
