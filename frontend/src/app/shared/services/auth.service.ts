import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User, UserAuth, UserCredentials } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/user`;
  isAuthenticated = signal<UserAuth | undefined | null>(undefined);

  constructor(private http: HttpClient) { }

  register(userData: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: UserCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }
}
