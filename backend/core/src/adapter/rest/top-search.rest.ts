import {NextFunction, Request, Response} from 'express-serve-static-core';
import {skillSearchRepository} from '../elasticsearch/skill-search.elasticsearch-repository';
import {unwrapSkillNames} from './skill.rest';
import {userProfileSearchRepository} from '../elasticsearch/user-profile-search.elasticsearch-repository';
import {UserProfile} from '../../domain-model/user-profile';
import {AttributeMap} from '../../domain-model/common';

export function searchForSkillsAndUserProfilesByNames(req: Request, res: Response, next: NextFunction): void {
  let query = req?.query?.['query'];
  query = typeof query === 'string' ? query : ''; // ignore arrays

  Promise.all([
    skillSearchRepository.search(query)
      .then(unwrapSkillNames),
    userProfileSearchRepository.searchByUsername(query)
      .then(transformUserProfilesToAttributeMaps)
  ])
    .then(([skills, userProfiles]) => ({skills, userProfiles}))
    .then(skillsAndProfiles => res.status(200).send(skillsAndProfiles))
    .catch(next); // handle globally

}

function transformUserProfilesToAttributeMaps(userProfiles: UserProfile[]): AttributeMap[] {
  return userProfiles.map(userProfile => userProfile.toPlainAttributes());
}
