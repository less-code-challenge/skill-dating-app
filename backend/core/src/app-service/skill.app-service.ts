import {Skill, SkillName} from '../domain-model/skill';
import {skillRepository} from '../adapter/dynamodb/skill.dynamodb-repository';
import {skillSearchRepository} from '../adapter/elasticsearch/skill-search.elasticsearch-repository';

class SkillAppService {
  createNewSkill(name: string): Promise<Skill> {
    try {
      const skillName = SkillName.parse(name);
      return skillRepository.createNew(skillName);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  search(query?: string): Promise<SkillName[]> {
    return skillSearchRepository.search(query);
  }
}

export = new SkillAppService();
