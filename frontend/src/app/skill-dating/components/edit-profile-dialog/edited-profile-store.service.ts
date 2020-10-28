import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileTo } from '../../model/user-profile.to';

@Injectable()
export class EditedProfileStoreService {
  public readonly editedUserProfile = new BehaviorSubject<
    UserProfileTo | undefined
  >(undefined);

  constructor(public readonly router: Router) {}

  profileChanged(changedProfile: UserProfileTo): void {
    this.editedUserProfile.next(changedProfile);
  }
  clear(): void {
    this.editedUserProfile.next(undefined);
  }
}
