import {Skill, SkillId, SkillMap, SkillName} from './skill';

export interface SkillRepository {
  findByIds(ids: SkillId[]): Promise<SkillMap>;
  createNew(skillName: SkillName): Promise<Skill>;
  findAll(): Promise<Skill[]>;
}
