import {Username, UserProfile} from './user-profile';
import {SkillUpdate} from './skill';

export interface UserProfileRepository {
  findByUsername(username: Username): Promise<UserProfile | null>;
  createNew(userProfile: UserProfile): Promise<UserProfile>;
  update(newUserProfile: UserProfile, skillUpdate: SkillUpdate): Promise<UserProfile>;
}
