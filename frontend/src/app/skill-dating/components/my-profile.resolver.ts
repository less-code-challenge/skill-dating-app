import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {UserProfile} from '../model/user-profile.to';

import {UserProfileClientService} from '../services/user-profile.client';
import {SecurityService} from '../../shared/security/security.service';

@Injectable({providedIn: 'root'})
export class MyProfileResolverService implements Resolve<UserProfile> {
  constructor(
    private readonly userProfileClientService: UserProfileClientService,
    private readonly security: SecurityService
  ) {
  }

  resolve(): Observable<UserProfile> {
    return this.security.user$
      .pipe(switchMap((user) => {
          return this.userProfileClientService.getUserProfile(user.username)
            .pipe(
              catchError(() => of({...user})),
              map(userProfile => ({...user, ...userProfile}))
            );
        })
      );
  }
}
