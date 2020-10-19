import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RecentSearchTo } from '../model/recent-search.to';

@Injectable({
  providedIn: 'root',
})
export class RecentSearchClientService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<RecentSearchTo[]> {
    // return this.http.get<RecentSearchTo[]>(`${this.backendUri}${RECENT_SEARCH_PATH}`);
    return of([
      { id: '1', name: 'Java' },
      { id: '2', name: 'React' },
      { id: '3', name: 'GoLang' },
    ]);
  }
}
