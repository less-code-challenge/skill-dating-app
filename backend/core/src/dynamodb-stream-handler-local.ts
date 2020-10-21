import {skillSearchRepository} from './adapter/elasticsearch/skill-search.elasticsearch-repository';
import {Skill} from './domain-model/skill';

skillSearchRepository.search('Jav')
  .catch(error => console.error(error));

// skillSearchRepository.onNewSkillCreation(Skill.parse('3ODWQ2PXWSEMRQ', 'JavaScript'))
//   .catch(error => console.error(error));


// skillSearchRepository.onSkillUpdates(
//   {
//     documentsToCreateOrUpdate: [
//       Skill.parse('01XFYT3OJMMI4H', 'Java 13')
//     ], documentsToDelete: []
//   })
//   .catch(error => console.error(error));
