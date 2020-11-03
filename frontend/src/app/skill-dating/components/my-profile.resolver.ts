import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {UserProfile} from '../model/user-profile.to';
import {SecurityService} from '../../shared/security/security.service';
import {UserProfileService} from '../services/user-profile.service';

@Injectable({providedIn: 'root'})
export class MyProfileResolverService implements Resolve<UserProfile> {
  constructor(
    private readonly userProfiles: UserProfileService,
    private readonly security: SecurityService
  ) {
  }

  resolve(): Observable<UserProfile> {
    return this.security.user$
      .pipe(switchMap((user) => {
          return this.userProfiles.get(user.username)
            .pipe(
              catchError(() => of({...user})),
              map(userProfile => ({...user, ...userProfile}))
            );
        })
      );
  }
}
