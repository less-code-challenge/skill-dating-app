import {NextFunction, Request, Response} from 'express-serve-static-core';
import userProfileAppService from '../../app-service/user-profile.app-service';
import {Username} from '../../domain-model/user-profile';

export function getOne(req: Request, res: Response, next: NextFunction): void {
  const username = req.params?.['username'];

  userProfileAppService.loadUserProfile(username)
    .then(userProfile => userProfile ? res.send(userProfile.toPlainAttributes()) : res.sendStatus(404))
    .catch(next); // handle globally
}

export function createNewOrUpdateExisting(req: Request, res: Response, next: NextFunction): void {
  const userProfileAttributes = req.body;
  const username = userProfileAttributes?.[Username.attributeName] || req.params?.[Username.attributeName];
  // const securityContext = getSecurityContextFrom(req);

  userProfileAppService.createNewUserProfileOrUpdateExistingOne(username, userProfileAttributes)
    .then(userProfile => res.status(201).send(userProfile.toPlainAttributes()))
    .catch(next); // handle globally
}
