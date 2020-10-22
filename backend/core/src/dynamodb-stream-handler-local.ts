import {skillSearchRepository} from './adapter/elasticsearch/skill-search.elasticsearch-repository';

skillSearchRepository.search('Jav')
  .catch(error => console.error(error));
