import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserProfileTo} from '../model/user-profile.to';

@Injectable({
  providedIn: 'root',
})
export class UserProfileClientService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {}

  getUserProfile(username: string): Observable<UserProfileTo> {
    return this.http.get<UserProfileTo>(
      `${this.backendUri}/user-profiles/${username}`
    );
  }
  createUserProfile(userProfile: UserProfileTo): Observable<UserProfileTo> {
    return this.http.post<UserProfileTo>(
      `${this.backendUri}/user-profiles`,
      userProfile
    );
  }
  updateUserProfile(userProfile: UserProfileTo): Observable<UserProfileTo> {
    return this.http.put<UserProfileTo>(
      `${this.backendUri}/user-profiles/${userProfile.username}`,
      userProfile
    );
  }
}
