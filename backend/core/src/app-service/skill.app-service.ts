import {Skill, SkillName} from '../domain-model/skill';
import {skillRepository} from '../adapter/dynamodb/skill.dynamodb-repository';

class SkillAppService {
  createNewSkill(name: string): Promise<Skill> {
    try {
      const skillName = SkillName.parse(name);
      return skillRepository.createNew(skillName);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  findAll(): Promise<Skill[]> {
    return skillRepository.findAll();
  }
}

export = new SkillAppService();
