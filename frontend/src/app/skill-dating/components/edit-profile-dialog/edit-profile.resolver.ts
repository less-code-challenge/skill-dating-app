import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserProfileTo } from '../../model/user-profile.to';
import { UserProfileClientService } from '../../services/user-profile.client';

@Injectable({ providedIn: 'root' })
export class EditProfileResolverService
  implements Resolve<Observable<UserProfileTo>> {
  constructor(private readonly userProfileService: UserProfileClientService) {}

  resolve(): Observable<UserProfileTo> {
    // return this.userProfileService.getUserProfile();
    return of(undefined) as any;
  }
}
