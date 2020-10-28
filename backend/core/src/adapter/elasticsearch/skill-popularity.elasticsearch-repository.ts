import {mergeWith, SkillPopularity} from '../../domain-model/skill';
import {createClient} from './common';
import {appConfig} from '../../app-config';
import {SkillPopularityRepository} from '../../domain-model/skill-popularity.repository';

const skillPopularityIndex = appConfig.elasticsearchSkillPopularityIndex;
const skillPopularityId = 'skillPopularity';

export class SkillPopularityElasticsearchRepository implements SkillPopularityRepository {
  get(): Promise<SkillPopularity> {
    return createClient().search({
      index: skillPopularityIndex,
      body: {query: {term: {_id: {value: skillPopularityId}}}}
    }).then(({body}) => {
      let result: SkillPopularity = {};
      const skillPopularityHits = body?.hits?.hits;
      if (skillPopularityHits && skillPopularityHits.length > 0) {
        result = skillPopularityHits[0]?._source;
      }
      return result;
    });
  }

  merge(newSkillPopularity: SkillPopularity): Promise<void> {
    return this.get().then(mergeWith(newSkillPopularity))
      .then(mergedSkillPopularity => this.update(mergedSkillPopularity));
  }

  private update(newSkillPopularity: SkillPopularity): Promise<void> {
    return createClient().update({
      index: skillPopularityIndex,
      id: skillPopularityId,
      body: newSkillPopularity
    }).then(() => undefined);
  }
}

export const skillPopularityRepository: SkillPopularityRepository = new SkillPopularityElasticsearchRepository();
