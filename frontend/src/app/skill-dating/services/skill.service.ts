import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {
  }

  findAll(): Observable<string[]> {
    return this.http.get<string[]>(`${this.backendUri}/search/skills`);
  }
}
