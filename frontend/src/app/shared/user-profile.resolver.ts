import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserProfileTo } from '../skill-dating/model/user-profile.to';

import { UserProfileClientService } from '../skill-dating/services/user-profile.client';

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
    return this.userProfileClientService.getUserProfile(username);
  }
}
