import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserInterface } from '../models/user';
import { Observable,  } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;
  private http = inject(HttpClient);

  constructor() {
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<UserInterface>(`${this.apiUrl}/${id}`);
  }

  getProfileImageUrl(user: UserInterface): string {
    const baseUrl = environment.apiUrl;
    if (user.imageProfile) {
      return `${baseUrl}/uploads/user/${user.imageProfile}`;
    } else {
      return `${baseUrl}/uploads/user/default.jpg`;
    }
  }

}
