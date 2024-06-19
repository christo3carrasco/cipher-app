import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VotingData } from '../../models/voting/voting-data';
import { Voting } from '../../models/voting/voting';

@Injectable({
  providedIn: 'root',
})
export class VotingApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllVotings(): Observable<Voting[]> {
    return this.http.get<Voting[]>(`${this.apiUrl}/voting`);
  }

  getVotingById(id: string): Observable<Voting> {
    const url = `${this.apiUrl}/voting/${id}`;
    return this.http
      .get<{ voting: Voting }>(url)
      .pipe(map((response) => response.voting));
  }

  getVotingsByParams(params: any): Observable<Voting[]> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http
      .get<{ votings: Voting[] }>(`${this.apiUrl}/voting`, {
        params: httpParams,
      })
      .pipe(map((response) => response.votings));
  }

  createVoting(votingData: VotingData): Observable<Voting> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Voting>(`${this.apiUrl}/voting`, votingData, {
      headers,
    });
  }

  updateVoting(id: string, update: Partial<Voting>): Observable<Voting> {
    const url = `${this.apiUrl}/voting/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Voting>(url, update, { headers });
  }

  deleteVoting(id: string): Observable<void> {
    const url = `${this.apiUrl}/voting/${id}`;
    return this.http.delete<void>(url);
  }
}
