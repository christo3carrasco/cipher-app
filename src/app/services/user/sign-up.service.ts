import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SignUpData } from '../../models/user/sign-up-data';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signUp(signUpData: SignUpData): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const date = new Date(signUpData.dateOfBirth);
    const dateOnly = date.toISOString().split('T')[0];
    signUpData.dateOfBirth = dateOnly;

    return this.http.post<User>(`${this.apiUrl}/user`, signUpData, { headers });
  }
}
