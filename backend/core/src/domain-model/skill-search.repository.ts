import {Skill, SkillId, SkillName} from './skill';
import {DocumentUpdates} from './common';

export type SkillUpdates = DocumentUpdates<Skill, SkillId>

export interface SkillSearchRepository {
  onSkillUpdates(skillUpdates: SkillUpdates): Promise<void>;
  search(query?: string): Promise<SkillName[]>;
}
