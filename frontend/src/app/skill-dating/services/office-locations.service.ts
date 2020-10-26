import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OfficeLocationTo } from '../model/office-location.to';

@Injectable({
  providedIn: 'root',
})
export class OfficeLocationsService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {}

  getAllOfficeLocation(): Observable<OfficeLocationTo[]> {
    return this.http.get<OfficeLocationTo[]>(
      `${this.backendUri}/office-locations`
    );
  }
}
