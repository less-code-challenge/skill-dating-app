import {SkillSearchRepository} from '../../domain-model/skill-search.repository';
import {Skill} from '../../domain-model/skill';
import {Client} from '@elastic/elasticsearch';

export class SkillSearchElasticsearchRepository implements SkillSearchRepository {
  onNewSkillCreation(skill: Skill): Promise<void> {
    const client = new Client({
      node: 'https://search-user-profiles-folbu7t6tixn2vdcu5zn4vfupq.eu-central-1.es.amazonaws.com/',
      auth: {
        username: 'elastic',
        password: '!Miszcz79!'
      }
    });


    return client.update({
      index: 'skills',
      id: skill.id.value,
      body: skill.toPlainAttributes()
    }).then(() => undefined);
  }
}

export const skillSearchRepository: SkillSearchRepository = new SkillSearchElasticsearchRepository();
