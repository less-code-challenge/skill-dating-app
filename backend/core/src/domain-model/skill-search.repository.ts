import {Skill} from './skill';

export interface SkillSearchRepository {
  onNewSkillCreation(skill: Skill): Promise<void>;
  search(): Promise<Skill[]>;
}
