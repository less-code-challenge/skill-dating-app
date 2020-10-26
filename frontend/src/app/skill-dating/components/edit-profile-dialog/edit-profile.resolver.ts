import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SecurityService } from 'src/app/shared/security/security.service';
import { UserProfileTo } from '../../model/user-profile.to';
import { UserProfileClientService } from '../../services/user-profile.client';

@Injectable({ providedIn: 'root' })
export class EditProfileResolverService
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
