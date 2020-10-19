import {skillSearchRepository} from './adapter/elasticsearch/skill-search.elasticsearch-repository';
import {Skill} from './domain-model/skill';

// skillSearchRepository.search()
//   .catch(error => console.error(error));

skillSearchRepository.onNewSkillCreation(Skill.parse('3ODWQ2PXWSEMRQ', 'JavaScript'))
  .catch(error => console.error(error));
