import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserProfileTo} from '../model/user-profile.to';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {}

  get(username: string): Observable<UserProfileTo> {
    return this.http.get<UserProfileTo>(
      `${this.backendUri}/user-profiles/${username}`
    );
  }
  create(userProfile: UserProfileTo): Observable<UserProfileTo> {
    return this.http.post<UserProfileTo>(
      `${this.backendUri}/user-profiles`,
      userProfile
    );
  }
  update(userProfile: UserProfileTo): Observable<UserProfileTo> {
    return this.http.put<UserProfileTo>(
      `${this.backendUri}/user-profiles/${userProfile.username}`,
      userProfile
    );
  }
}
