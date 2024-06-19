import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user`);
  }

  getUserById(id: string): Observable<User> {
    const url = `${this.apiUrl}/user/${id}`;
    return this.http
      .get<{ user: User }>(url)
      .pipe(map((response) => response.user));
  }

  getUsersByParams(params: any): Observable<User[]> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http
      .get<{ users: User[] }>(`${this.apiUrl}/user`, {
        params: httpParams,
      })
      .pipe(map((response) => response.users));
  }

  deleteUser(id: string): Observable<void> {
    const url = `${this.apiUrl}/user/${id}`;
    return this.http.delete<void>(url);
  }
}
