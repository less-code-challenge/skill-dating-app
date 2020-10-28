import {SkillPopularity} from './skill';

export interface SkillPopularityRepository {
  merge(skillPopularity: SkillPopularity): Promise<void>;

  get(): Promise<SkillPopularity>;
}
