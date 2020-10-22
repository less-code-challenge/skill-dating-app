import {UserProfileSearchRepository} from '../../domain-model/user-profile-search.repository';
import {SkillName} from '../../domain-model/skill';
import {UserProfile} from '../../domain-model/user-profile';
import {bulk, createClient} from './common';
import {AttributeMap, DocumentUpdates} from '../../domain-model/common';
import {appConfig} from '../../app-config';
import {RequestParams} from '@elastic/elasticsearch';

const userProfileElasticsearchIndex = appConfig.elasticsearchUserProfileIndex;

export class UserProfileSearchElasticsearchRepository implements UserProfileSearchRepository {
  onUserProfileUpdates(userProfileUpdates: DocumentUpdates<UserProfile>): Promise<void> {
    return bulk(userProfileUpdates, userProfileElasticsearchIndex);
  }

  searchBySkills(skillNames: SkillName[]): Promise<UserProfile[]> {
    const searchParams: RequestParams.Search = {index: userProfileElasticsearchIndex};
    if (skillNames && skillNames.length > 0) {
      searchParams.body = {
        query: {
          bool: {
            must: skillNames.map(skillName => ({term: {'skills.keyword': skillName.value}}))
          }
        }
      };
    }

    return this.searchUsing(searchParams);
  }

  searchByUsername(usernameQuery?: string): Promise<UserProfile[]> {
    const trimmedQuery = usernameQuery?.trim();
    const searchParams: RequestParams.Search = {index: userProfileElasticsearchIndex};
    if (trimmedQuery) {
      searchParams.body = {
        query: {
          wildcard: {
            username: {
              value: `*${trimmedQuery}*`
            }
          }
        }
      };
    }

    return this.searchUsing(searchParams);
  }

  private searchUsing(searchParams: RequestParams.Search): Promise<UserProfile[]> {
    return createClient().search(searchParams)
      .then(({body}) => {
          const matchingUserProfiles = body?.hits?.hits;
          if (matchingUserProfiles && matchingUserProfiles.length > 0) {
            return matchingUserProfiles.map((matchingSkill: { _source: { username: string } & AttributeMap; }) =>
              UserProfile.builder(matchingSkill._source.username).attributes(matchingSkill._source).build());
          }
          return [];
        }
      );
  }
}

export const userProfileSearchRepository: UserProfileSearchRepository = new UserProfileSearchElasticsearchRepository();
