import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Option } from '../../models/option/option';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OptionApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOptionById(id: string): Observable<Option[]> {
    const url = `${this.apiUrl}/option/${id}`;
    return this.http
      .get<{ details: Option[] }>(url)
      .pipe(map((response) => response.details));
  }

  createOption(id: string, name: string): Observable<string> {
    const url = `${this.apiUrl}/option/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(url, { name }, { headers });
  }
}
