import {Username, UserProfile} from './user-profile';

export interface UserProfileRepository {
  findByUsername(username: Username): Promise<UserProfile | null>;
  createNewOrUpdate(userProfile: UserProfile): Promise<UserProfile>;
}
