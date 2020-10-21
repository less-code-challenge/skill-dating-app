import {DocumentUpdates} from './common';
import {UserProfile} from './user-profile';
import {SkillName} from './skill';

export interface UserProfileSearchRepository {
  onUserProfileUpdates(userProfileUpdates: DocumentUpdates<UserProfile>): Promise<void>;

  searchBySkills(skillNames: SkillName[]): Promise<UserProfile[]>;

  searchByUsername(usernameQuery?: string): Promise<UserProfile[]>;
}
