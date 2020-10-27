import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SecurityService } from 'src/app/shared/security/security.service';
import { OfficeLocationTo } from '../../model/office-location.to';
import { UserProfileTo } from '../../model/user-profile.to';
import { OfficeLocationsService } from '../../services/office-locations.service';
import { UserProfileClientService } from '../../services/user-profile.client';

@Injectable({ providedIn: 'root' })
export class OfficeLocationsResolverService
  implements Resolve<Observable<OfficeLocationTo[]>> {
  constructor(
    private readonly officeLocationsService: OfficeLocationsService,
    private readonly security: SecurityService
  ) {}

  resolve(): Observable<OfficeLocationTo[]> {
    return this.officeLocationsService.getAllOfficeLocation();
  }
}
