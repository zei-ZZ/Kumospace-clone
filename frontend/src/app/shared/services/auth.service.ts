import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(userData: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }
}
