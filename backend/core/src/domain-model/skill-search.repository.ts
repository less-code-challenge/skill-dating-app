import {Skill, SkillName} from './skill';
import {DocumentUpdates} from './common';

export interface SkillSearchRepository {
  onSkillUpdates(skillUpdates: DocumentUpdates<Skill>): Promise<void>;

  search(query?: string): Promise<SkillName[]>;

  skillsExist(skills: SkillName[] | undefined): Promise<void>;
}
