import {SkillSearchRepository, SkillUpdates} from '../../domain-model/skill-search.repository';
import {SkillName} from '../../domain-model/skill';
import {Client, RequestParams} from '@elastic/elasticsearch';

const skillElasticsearchIndex = 'skills';

export class SkillSearchElasticsearchRepository implements SkillSearchRepository {
  private static get client() {
    return new Client({
      node: 'https://search-user-profiles-folbu7t6tixn2vdcu5zn4vfupq.eu-central-1.es.amazonaws.com/',
      auth: {
        username: 'elastic',
        password: '!Miszcz79!'
      }
    });
  }

  onSkillUpdates(skillUpdates: SkillUpdates): Promise<void> {
    const bulkOperations: Record<string, any>[] = [];
    const skillsToDelete = skillUpdates?.documentsToDelete;
    if (skillsToDelete) {
      skillsToDelete.forEach(skillId => {
        bulkOperations.push({delete: {_index: skillElasticsearchIndex, _id: skillId.value}});
      });
    }

    const skillsToCreateOrUpdate = skillUpdates?.documentsToCreateOrUpdate;
    if (skillsToCreateOrUpdate) {
      skillsToCreateOrUpdate.forEach(skill => {
        bulkOperations.push({index: {_index: skillElasticsearchIndex, _id: skill.id.value}});
        bulkOperations.push(skill.toPlainAttributes());
      });
    }

    if (bulkOperations.length > 0) {
      return SkillSearchElasticsearchRepository.client.bulk({refresh: true, body: bulkOperations})
        .then(({body}) => {
          if (body.errors) {
            console.warn('Some skills have not been processed correctly', body.items);
          }
        });
    }
    return Promise.resolve();
  }

  search(query?: string): Promise<SkillName[]> {
    const trimmedQuery = query?.trim();
    const searchParams: RequestParams.Search = {index: skillElasticsearchIndex};
    if (trimmedQuery) {
      searchParams.body = {
        query: {
          wildcard: {
            name: {
              value: `*${trimmedQuery}*`
            }
          }
        }
      };
    }

    return SkillSearchElasticsearchRepository.client.search(searchParams)
      .then(({body}) => {
          const matchingSkills = body?.hits?.hits;
          if (matchingSkills && matchingSkills.length > 0) {
            return matchingSkills.map((matchingSkill: { _source: { id: string, name: string }; }) => SkillName.parse(matchingSkill?._source?.name));
          }
          return [];
        }
      );
  }
}

export const skillSearchRepository: SkillSearchRepository = new SkillSearchElasticsearchRepository();
