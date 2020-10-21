import {Skill, SkillName} from './skill';

export interface SkillRepository {
  createNew(skillName: SkillName): Promise<Skill>;
}
