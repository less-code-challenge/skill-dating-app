import {NextFunction, Request, Response} from 'express-serve-static-core';
import userProfileAppService from '../../app-service/user-profile.app-service';
import {Username} from '../../domain-model/user-profile';
import {getSecurityContextFrom} from '../../security-context';

export function getOne(req: Request, res: Response, next: NextFunction): void {
  const username = req.params?.['username'];

  userProfileAppService.loadUserProfile(username)
    .then(userProfile => userProfile ? res.send(userProfile.toPlainAttributes()) : res.sendStatus(404))
    .catch(next); // handle globally
}

export function createNewOrUpdateExisting(req: Request, res: Response, next: NextFunction): void {
  const userProfileAttributes = req.body;
  const username = userProfileAttributes?.[Username.attributeName] || req.params?.[Username.attributeName];

  userProfileIsAboutToBeCreatedOrUpdatedByItsOwner(username, req)
    .then(
      () => userProfileAppService.createNewUserProfileOrUpdateExistingOne(username, userProfileAttributes).then(userProfile => res.status(201).send(userProfile.toPlainAttributes())),
      () => res.sendStatus(401)
    )
    .catch(next); // handle globally

  function userProfileIsAboutToBeCreatedOrUpdatedByItsOwner(username: string, req: Request): Promise<void> {
    const securityContext = getSecurityContextFrom(req);
    return securityContext.currentUsername === username ? Promise.resolve() : Promise.reject();
  }

  userProfileAppService.createNewUserProfileOrUpdateExistingOne(username, userProfileAttributes)
    .then(userProfile => res.status(201).send(userProfile.toPlainAttributes()))
    .catch(next); // handle globally
}

export function searchForUserProfilesBySkills(req: Request, res: Response, next: NextFunction): void {
  let commaSeparatedSkills = req.query?.['skills'];
  commaSeparatedSkills = typeof commaSeparatedSkills === 'string' ? commaSeparatedSkills : ''; // ignore arrays
  const skills = commaSeparatedSkills?.split(',');

  userProfileAppService.searchBySkills(skills)
    .then(matchingUserProfiles => res.status(200).send(
      matchingUserProfiles.map(userProfile => userProfile.toPlainAttributes())))
    .catch(next); // handle globally

}
