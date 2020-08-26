import {NextFunction, Request, Response} from 'express-serve-static-core';
import userProfileAppService from '../../app-service/user-profile.app-service';
import {DocumentAlreadyExistsError, DocumentNotExistsError} from '../../domain-model/common';

export function getOne(req: Request, res: Response, next: NextFunction): void {
  const username = req.params['username'];
  userProfileAppService.loadUserProfile(username)
    .then(userProfile => userProfile ? res.send(userProfile.toPlainAttributes()) : res.sendStatus(404))
    .catch(next); // handle globally
}

export function createNew(req: Request, res: Response, next: NextFunction): void {
  const username = req.body?.username;
  userProfileAppService.createNewUserProfile(username)
    .then(
      userProfile => res.status(201).send(userProfile.toPlainAttributes()),
      error => {
        if (DocumentAlreadyExistsError.NAME === error.name) {
          res.sendStatus(409);
        } else {
          next(error); // handle globally
        }
      }
    );
}

export function update(req: Request, res: Response, next: NextFunction): void {
  const username = req.params['username'];
  const userProfileAttributes = req.body;
  if (!userProfileAttributes) {
    res.sendStatus(400);
  }
  userProfileAppService.updateUserProfile(username, userProfileAttributes)
    .then(
      userProfile => res.send(userProfile.toPlainAttributes()),
      error => {
        switch (error.name) {
          case DocumentNotExistsError.NAME:
            res.sendStatus(404);
            break;
          default:
            next(error); // handle globally
        }
      }
    );
}
