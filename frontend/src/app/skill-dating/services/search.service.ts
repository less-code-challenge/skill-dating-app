import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {toUserProfile, UserProfile, UserProfilesAndSkills, UserProfileTo} from '../model/user-profile.to';
import {map} from 'rxjs/operators';

interface UserProfileTosAndSkills {
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
    return this.http.get<UserProfileTosAndSkills>(`${this.backendUri}/search/top`, {params})
      .pipe(map(userProfileTosAndSkills => {
        const userProfiles = userProfileTosAndSkills.userProfiles?.map(toUserProfile) || [];
        return {skills: userProfileTosAndSkills.skills, userProfiles};
      }));
  }

  userProfilesBySkills(skills: string[]): Observable<UserProfile[]> {
    const params = new HttpParams().append('skills', skills?.join(',') || '');
    return this.http.get<UserProfileTo[]>(`${this.backendUri}/search/user-profiles`, {params})
      .pipe(
        map(userProfileTos => userProfileTos?.map(toUserProfile) || [])
      );
  }

  skills(query: string): Observable<string[]> {
    const params = new HttpParams().append('query', query);
    return this.http.get<string[]>(`${this.backendUri}/search/skills`, {params});
  }
}
