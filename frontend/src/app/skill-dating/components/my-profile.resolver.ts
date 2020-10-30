import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {UserProfile} from '../model/user-profile.to';

import {UserProfileClientService} from '../services/user-profile.client';
import {SecurityService} from '../../shared/security/security.service';

@Injectable({providedIn: 'root'})
export class MyProfileResolverService
  implements Resolve<Observable<UserProfile | undefined>> {
  constructor(
    private readonly userProfileClientService: UserProfileClientService,
    private readonly security: SecurityService
  ) {
  }

  resolve(): Observable<UserProfile | undefined> {
    return this.security.user$
      .pipe(
        switchMap((user) => {
            if (user) {
              return this.userProfileClientService.getUserProfile(user.username)
                .pipe(
                  catchError(() => of({...user})),
                  map(userProfile => ({...user, ...userProfile}))
                );
            } else {
              return throwError('Session expired');
            }
          }
        )
      );
  }
}
