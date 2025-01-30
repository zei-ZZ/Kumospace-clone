import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserDto } from '../models/user';
import { Observable,  } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;
  private http = inject(HttpClient);
  
  getUserById(id: string): Observable<any> {
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`);
  }

  getProfileImageUrl(user: UserDto): string {
    const baseUrl = environment.apiUrl;
    if (user.imageProfile) {
      return `${baseUrl}/uploads/user/${user.imageProfile}`;
    } else {
      return `${baseUrl}/assets/default.jpg`;
    }
  }

  uploadProfilePhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/photo`, formData);
  }

}