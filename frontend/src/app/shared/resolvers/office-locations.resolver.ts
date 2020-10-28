import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { OfficeLocationTo } from 'src/app/skill-dating/model/office-location.to';
import { OfficeLocationsService } from 'src/app/skill-dating/services/office-locations.service';

@Injectable({ providedIn: 'root' })
export class OfficeLocationsResolverService
  implements Resolve<Observable<OfficeLocationTo[]>> {
  constructor(
    private readonly officeLocationsService: OfficeLocationsService
  ) {}

  resolve(): Observable<OfficeLocationTo[]> {
    return this.officeLocationsService.getAllOfficeLocation();
  }
}
