import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { UserProfileTo } from '../model/user-profile.to';

import { UserProfileClientService } from '../services/user-profile.client';
import { SecurityService } from '../../shared/security/security.service';

@Injectable({ providedIn: 'root' })
export class MyProfileResolverService
  implements Resolve<Observable<UserProfileTo | undefined>> {
  constructor(
    private readonly userProfileClientService: UserProfileClientService,
    private readonly security: SecurityService
  ) {}

  resolve(): Observable<UserProfileTo | undefined> {
    return this.security.username$.pipe(
      map((username) => username.split('@')[0]),
      switchMap((username) =>
        this.userProfileClientService.getUserProfile(username)
      ),
      catchError(() => of(undefined))
    );
  }
}
