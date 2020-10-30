import {OfficeLocationTo} from './office-location.to';
import {createUserFrom, User} from '../../shared/security/user';

export interface UserProfileTo {
  username: string;
  description?: string;
  phoneNo?: string;
  officeLocation?: OfficeLocationTo;
  skills?: string[];
}

export type UserProfile = User & UserProfileTo;

export interface UserProfilesAndSkills {
  skills: string[];
  userProfiles: UserProfile[];
}

export function toUserProfile(userProfileTo: UserProfileTo): UserProfile {
  if (!userProfileTo) {
    throw new Error('UserProfileTo not provided');
  }

  const email = `${userProfileTo.username}@capgemini.com`;
  const user = createUserFrom(email);

  return {...user, ...userProfileTo};
}
