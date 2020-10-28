import {NextFunction, Request, Response} from 'express-serve-static-core';
import {skillPopularityRepository} from '../elasticsearch/skill-popularity.elasticsearch-repository';

export function getSkillPopularity(req: Request, res: Response, next: NextFunction): void {
  skillPopularityRepository.get()
    .then(skillPopularity => res.status(200).send(skillPopularity))
    .catch(next);  // handle globally
}
