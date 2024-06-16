import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SignInData } from '../../models/user/sign-in-data';
import { SignInResponse } from '../../models/user/sign-in-response';

@Injectable({
  providedIn: 'root',
})
export class SignInService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  signIn(signInData: SignInData): Observable<SignInResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<SignInResponse>(
      `${this.apiUrl}/auth/login`,
      signInData,
      { headers }
    );
  }
}
