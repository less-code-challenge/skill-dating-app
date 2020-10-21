import {UserProfileSearchRepository} from '../../domain-model/user-profile-search.repository';
import {SkillName} from '../../domain-model/skill';
import {UserProfile} from '../../domain-model/user-profile';
import {bulk} from './common';
import {DocumentUpdates} from '../../domain-model/common';

const userProfileElasticsearchIndex = 'skills';

export class UserProfileSearchElasticsearchRepository implements UserProfileSearchRepository {
  onUserProfileUpdates(userProfileUpdates: DocumentUpdates<UserProfile>): Promise<void> {
    return bulk(userProfileUpdates, userProfileElasticsearchIndex);
  }

  searchBySkills(skillNames: SkillName[]): Promise<UserProfile[]> {
    return Promise.resolve([]);
  }

  searchByUsername(usernameQuery?: string): Promise<UserProfile[]> {
    return Promise.resolve([]);
  }
}

export const userProfileSearchRepository: UserProfileSearchRepository = new UserProfileSearchElasticsearchRepository();
