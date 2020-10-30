import {UserProfileSearchRepository} from '../../domain-model/user-profile-search.repository';
import {SkillName} from '../../domain-model/skill';
import {UserProfile, userProfileFactory} from '../../domain-model/user-profile';
import {bulk, createClient, createSearchParams} from './common';
import {AttributeMap, DocumentUpdates} from '../../domain-model/common';
import {appConfig} from '../../app-config';

const userProfileElasticsearchIndex = appConfig.elasticsearchUserProfileIndex;

export class UserProfileSearchElasticsearchRepository implements UserProfileSearchRepository {
  onUserProfileUpdates(userProfileUpdates: DocumentUpdates<UserProfile>): Promise<void> {
    return bulk(userProfileUpdates, userProfileElasticsearchIndex);
  }

  searchBySkills(skillNames: SkillName[]): Promise<UserProfile[]> {
    const body = skillNames && skillNames.length > 0 ? {
      query: {
        bool: {
          must: skillNames.map(skillName => ({term: {'skills.keyword': skillName.value}}))
        }
      }
    } : null;

    return this.searchUsing(body);
  }

  searchByUsername(usernameQuery?: string): Promise<UserProfile[]> {
    const trimmedQuery = usernameQuery?.trim();
    const body = trimmedQuery ? {
      query: {
        wildcard: {
          username: {
            value: `*${trimmedQuery}*`
          }
        }
      }
    } : null;

    return this.searchUsing(body);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private searchUsing(queryBody?: any): Promise<UserProfile[]> {
    const searchParams = createSearchParams(userProfileElasticsearchIndex, queryBody);
    return createClient().search(searchParams)
      .then(({body}) => {
          const matchingUserProfiles = body?.hits?.hits;
          if (matchingUserProfiles && matchingUserProfiles.length > 0) {
            return matchingUserProfiles.map(
              (matchingSkill: { _source: AttributeMap; }) => userProfileFactory(matchingSkill._source));
          }
          return [];
        }
      );
  }
}

export const userProfileSearchRepository: UserProfileSearchRepository = new UserProfileSearchElasticsearchRepository();
