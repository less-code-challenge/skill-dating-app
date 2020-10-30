import {SkillSearchRepository} from '../../domain-model/skill-search.repository';
import {Skill, SkillName} from '../../domain-model/skill';
import {DocumentUpdates} from '../../domain-model/common';
import {bulk, createClient, createSearchParams} from './common';
import {appConfig} from '../../app-config';

const skillElasticsearchIndex = appConfig.elasticsearchSkillIndex;

export class SkillSearchElasticsearchRepository implements SkillSearchRepository {
  onSkillUpdates(skillUpdates: DocumentUpdates<Skill>): Promise<void> {
    return bulk(skillUpdates, skillElasticsearchIndex);
  }

  search(query?: string): Promise<SkillName[]> {
    const trimmedQuery = query?.trim();
    const body = trimmedQuery ? {
      query: {
        wildcard: {
          name: {
            value: `*${trimmedQuery}*`
          }
        }
      }
    } : null;
    return createClient().search(createSearchParams(skillElasticsearchIndex, body))
      .then(({body}) => {
          const matchingSkills = body?.hits?.hits;
          if (matchingSkills && matchingSkills.length > 0) {
            return matchingSkills.map((matchingSkill: { _source: { id: string, name: string }; }) => SkillName.parse(matchingSkill?._source?.name));
          }
          return [];
        }
      );
  }

  skillsExist(skills: SkillName[] | undefined): Promise<void> {
    if (skills && skills.length > 0) {
      const searchParams = createSearchParams(skillElasticsearchIndex, {
        query: {
          terms: {
            'name.keyword': skills.map(skillName => skillName.value)
          }
        }
      });
      return createClient().search(searchParams)
        .then(({body}) => {
            const matchingSkills = body?.hits?.hits;
            if (matchingSkills && matchingSkills.length !== skills.length) {
              return Promise.reject(new Error('Some skills are not registered'));
            }
          }
        );
    }
    return Promise.resolve();
  }
}

export const skillSearchRepository: SkillSearchRepository = new SkillSearchElasticsearchRepository();
