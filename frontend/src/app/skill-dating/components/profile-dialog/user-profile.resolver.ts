import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  userMyProfileOf,
  UserProfileTo,
} from 'src/app/skill-dating/model/user-profile.to';
import { UserProfileClientService } from 'src/app/skill-dating/services/user-profile.client';

@Injectable({ providedIn: 'root' })
export class UserProfileResolverService
  implements Resolve<Observable<UserProfileTo>> {
  constructor(
    private readonly userProfileClientService: UserProfileClientService
  ) {}

  resolve(
    activaterRouteSnapshot: ActivatedRouteSnapshot
  ): Observable<UserProfileTo> {
    const username = activaterRouteSnapshot.paramMap.get('username') as string;
    return this.userProfileClientService
      .getUserProfile(username)
      .pipe(map((profile) => userMyProfileOf(profile)));
  }
}
