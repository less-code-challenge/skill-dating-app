import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserProfile} from 'src/app/skill-dating/model/user-profile.to';
import {UserProfileClientService} from 'src/app/skill-dating/services/user-profile.client';
import {createUserFrom} from '../../../shared/security/user';

@Injectable({providedIn: 'root'})
export class UserProfileResolverService implements Resolve<UserProfile> {
  constructor(
    private readonly userProfileClientService: UserProfileClientService
  ) {
  }

  resolve(
    activatedRouteSnapshot: ActivatedRouteSnapshot
  ): Observable<UserProfile> {
    const username = activatedRouteSnapshot.paramMap.get('username') as string;
    return this.userProfileClientService
      .getUserProfile(username)
      .pipe(
        map((profile) => {
          const email = `${profile.username}@capgemini.com`;
          const user = createUserFrom(email);
          if (user) {
            return {...user, ...profile};
          }
          throw new Error('Malformed profile returned');
        }));
  }
}
