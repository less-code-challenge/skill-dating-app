import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileTo } from '../skill-dating/model/user-profile.to';

@Injectable()
export class UserContextService {
  private userProfile = new Subject<UserProfileTo>();
  readonly currentUser$: Observable<
    UserProfileTo
  > = this.userProfile.asObservable();

  constructor(public readonly router: Router) {}

  initialize(email: string): void{
    this.userProfile.next();
  }

  profileChanged(changedProfile: UserProfileTo): void{
    this.userProfile.next(changedProfile);
  }
}
