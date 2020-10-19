import {SkillSearchRepository} from '../../domain-model/skill-search.repository';
import {Skill} from '../../domain-model/skill';
import {Client} from '@elastic/elasticsearch';

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

  onNewSkillCreation(skill: Skill): Promise<void> {
    return SkillSearchElasticsearchRepository.client.index({
      index: 'skills',
      id: skill.id.value,
      body: skill.toPlainAttributes()
    }).then(() => undefined);
  }

  search(): Promise<Skill[]> {
    return SkillSearchElasticsearchRepository.client.search({
      index: 'skills'
    }).then(res => console.log(res)).then(() => []);
  }
}

export const skillSearchRepository: SkillSearchRepository = new SkillSearchElasticsearchRepository();
