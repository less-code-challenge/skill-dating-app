import {NextFunction, Request, Response} from 'express-serve-static-core';
import {OfficeLocation} from '../../domain-model/office-location';

export function getAllOfficeLocation(req: Request, res: Response, next: NextFunction): void {
  try {
    const allOfficeLocations = OfficeLocation.all()
      .map(officeLocation => officeLocation.toPlainAttributes());
    res.status(200).send(allOfficeLocations);
  } catch (e) {
    next(e);
  }
}
