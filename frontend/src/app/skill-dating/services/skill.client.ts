import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PopularSkillsTo} from '../model/popular-skills.to';

@Injectable({
  providedIn: 'root',
})
export class SkillClientService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {
  }

  findAll(): Observable<PopularSkillsTo> {
    // return this.http.get<SkillTo[]>(`${this.backendUri}${SKILLS_PATH}`);
    return of({SQL: 100, 'Project Management': 643, Java: 564});
  }
}
