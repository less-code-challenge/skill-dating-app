import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {UserProfileTo} from '../../model/user-profile.to';

@Injectable({
  providedIn: 'root',
})
export class ProfileClientService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {
  }

  findOne(id: number): Observable<UserProfileTo> {
    // return this.http.get<UserProfileTo>(`${this.backendUri}${PROFILE_PATH}`);
    return of({
      username: 'qwertyk@capgemini.com',
      description: 'Fajny ziomek',
      phoneNo: '321654987',
      officeLocation: {
        region: 'Europe',
        country: 'Poland',
        office: 'Wrocław',
      },
      skills: ['Java'],
    } as UserProfileTo);
  }
}
