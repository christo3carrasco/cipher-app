import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Voter } from '../../models/voter/voter';
import { Observable, catchError, map, of } from 'rxjs';
import { VoterData } from '../../models/voter/voter-data';

@Injectable({
  providedIn: 'root',
})
export class VoterApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVoterById(id: string): Observable<Voter> {
    const url = `${this.apiUrl}/voting/${id}`;
    return this.http
      .get<{ voter: Voter }>(url)
      .pipe(map((response) => response.voter));
  }

  getVotersByParams(params: any): Observable<Voter[]> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http
      .get<{ voters: Voter[] }>(`${this.apiUrl}/voter`, { params: httpParams })
      .pipe(
        map((response) => response.voters),
        catchError((error) => {
          if (error.status === 404) {
            return of([]); // Devuelve un array vacío en caso de 404
          } else {
            throw error;
          }
        })
      );
  }

  createVoter(voterData: VoterData): Observable<Voter> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Voter>(`${this.apiUrl}/voter`, voterData, {
      headers,
    });
  }

  deleteVoter(id: string): Observable<void> {
    const url = `${this.apiUrl}/voter/${id}`;
    return this.http.delete<void>(url);
  }
}
