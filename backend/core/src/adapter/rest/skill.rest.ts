import {NextFunction, Request, Response} from 'express-serve-static-core';
import skillAppService from '../../app-service/skill.app-service';
import {DocumentAlreadyExistsError} from '../../domain-model/common';

export function createNew(req: Request, res: Response, next: NextFunction): void {
  const name = req.body?.name;
  skillAppService.createNewSkill(name)
    .then(
      newSkill => res.status(201).send(newSkill.toPlainAttributes()),
      error => {
        switch (error.name) {
          case DocumentAlreadyExistsError.NAME:
            res.sendStatus(409);
            break;
          default:
            next(error); // handle globally
        }
      }
    );
}

export function search(req: Request, res: Response, next: NextFunction): void {
  let query = req?.query?.['query'];
  query = typeof query === 'string' ? query : ''; // ignore arrays
  skillAppService.search(query)
    .then(skillNames => res.status(200).send(skillNames.map(skillName => skillName.value)))
    .catch(next); // handle globally
}
