import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UserProfileTo} from '../model/user-profile.to';

export interface UserProfilesAndSkills {
  skills: string[];
  userProfiles: UserProfileTo[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {
  }

  all(query: string): Observable<UserProfilesAndSkills> {
    const params = new HttpParams().append('query', query);
    return this.http.get<UserProfilesAndSkills>(`${this.backendUri}/search/top`, {params});
  }
}