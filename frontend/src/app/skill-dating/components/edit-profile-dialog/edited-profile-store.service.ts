import {Injectable} from '@angular/core';
import {UserProfileTo} from '../../model/user-profile.to';

@Injectable({
  providedIn: 'root'
})
export class EditedProfileStoreService {
  private editedUserProfile: UserProfileTo | undefined;

  get(): UserProfileTo | undefined {
    return this.editedUserProfile;
  }

  profileChanged(changedProfile: UserProfileTo): void {
    this.editedUserProfile = changedProfile;
  }

  clear(): void {
    this.editedUserProfile = undefined;
  }

  updateProfileOnSkills(newSkills: string[]): void {
    if (this.editedUserProfile) {
      this.editedUserProfile.skills = [...newSkills];
    }
  }

  init(profile: UserProfileTo): void {
    if (!this.editedUserProfile) {
      this.editedUserProfile = profile;
    }
  }
}
