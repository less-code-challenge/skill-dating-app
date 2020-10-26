import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PopularSkillsTo } from '../model/popular-skills.to';
import { SkillTo } from '../model/skill.to';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private readonly backendUri = environment.backendUri;

  constructor(private readonly http: HttpClient) {}
  findAll2(): Observable<PopularSkillsTo> {
    // return this.http.get<SkillTo[]>(`${this.backendUri}${SKILLS_PATH}`);
    return of({ SQL: 100, 'Project Management': 643, Java: 564 });
  }
  findAll(): Observable<string[]> {
    return this.http.get<string[]>(`${this.backendUri}/search/skills`);
  }

  createSkill(newSkill: SkillTo): Observable<SkillTo> {
    return this.http.post<SkillTo>(`${this.backendUri}/skills`, newSkill);
  }
}
