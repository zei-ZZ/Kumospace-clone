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
      this.validateToken(token).subscribe();
    }
  }

  validateToken(token: string): Observable<boolean> {
    return this.http.post<{valid: boolean; userId?: string}>(`${this.apiUrl}/validate-token`, { token }).pipe(
      tap(response => {
        if (response.valid) {
          this.isAuthenticated.set({
            id: response.userId || this.isAuthenticated()?.id!,
            token: token
          });
        } else {
          this.logout();
        }
      }),
      map(response => response.valid),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  register(userData: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        this.storageService.setItem(STORAGE_KEYS.USER_ID, response.user.id);
        this.storageService.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.user.token);
        this.isAuthenticated.set(response.user);
      })
    );
  }

  login(credentials: UserCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.storageService.setItem(STORAGE_KEYS.USER_ID, response.user.id);
        this.storageService.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.user.token);
        this.isAuthenticated.set(response.user);
      })
    );
  }

  logout() {
    this.storageService.removeItem(STORAGE_KEYS.USER_ID);
    this.storageService.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.isAuthenticated.set(null);
  }
}
