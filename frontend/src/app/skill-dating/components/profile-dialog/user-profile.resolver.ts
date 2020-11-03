import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserProfile} from 'src/app/skill-dating/model/user-profile.to';
import {createUserFrom} from '../../../shared/security/user';
import {UserProfileService} from '../../services/user-profile.service';

@Injectable({providedIn: 'root'})
export class UserProfileResolverService implements Resolve<UserProfile> {
  constructor(
    private readonly userProfiles: UserProfileService
  ) {
  }

  resolve(
    activatedRouteSnapshot: ActivatedRouteSnapshot
  ): Observable<UserProfile> {
    const username = activatedRouteSnapshot.paramMap.get('username') as string;
    return this.userProfiles
      .get(username)
      .pipe(
        map((profile) => {
          const email = `${profile.username}@capgemini.com`;
          const user = createUserFrom(email);
          return {...user, ...profile};
        }));
  }
}
