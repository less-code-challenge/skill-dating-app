import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { UserProfileTo } from '../skill-dating/model/user-profile.to';

import { UserProfileClientService } from '../skill-dating/services/user-profile.client';
import { SecurityService } from './security/security.service';
import { UserContextService } from './user-context.service';

@Injectable({ providedIn: 'root' })
export class MyProfileResolverService
  implements Resolve<Observable<UserProfileTo | undefined>> {
  constructor(
    private readonly userProfileClientService: UserProfileClientService,
    private readonly userContextService: UserContextService,
    private readonly security: SecurityService
  ) {}

  resolve(): Observable<UserProfileTo | undefined> {
    return this.security.username$.pipe(
      map((username) => username.split('@')[0]),
      switchMap((username) =>
        this.userProfileClientService.getUserProfile(username)
      ),
      tap((profile) => this.userContextService.profileChanged(profile)),
      catchError(() => of(undefined))
    );
  }
}
