import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Vote } from '../../models/vote/vote';

@Injectable({
  providedIn: 'root',
})
export class VoteApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVotesByParams(params: any): Observable<Vote[]> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http
      .get<{ votes: Vote[] }>(`${this.apiUrl}/vote`, {
        params: httpParams,
      })
      .pipe(map((response) => response.votes));
  }

  createVote(idVoter: string, option: number): Observable<Vote> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Vote>(
      `${this.apiUrl}/vote/${idVoter}/${option}`,
      {},
      {
        headers,
      }
    );
  }
}
