import {Injectable} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PopularSkillsTo} from '../model/popular-skills.to';
import {SkillTo} from '../model/skill.to';
import {shareReplay, switchMap, take} from 'rxjs/operators';

const refreshInterval = 3 * 60 * 1000; // 3 minutes

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private readonly backendUri = environment.backendUri;

  private popularSkillsCache$: Observable<PopularSkillsTo>;

  constructor(private readonly http: HttpClient) {
  }

  getPopularSkills(): Observable<PopularSkillsTo> {
    if (!this.popularSkillsCache$) {
      // Set up timer that ticks every 3 minutes
      const timer$ = timer(0, refreshInterval);
      this.popularSkillsCache$ = timer$.pipe(
        switchMap(() => this.http.get<PopularSkillsTo>(`${this.backendUri}/skill-popularity`)),
        shareReplay(1)
      );
    }
    return this.popularSkillsCache$.pipe(take(1));
  }

  findAll(): Observable<string[]> {
    return this.http.get<string[]>(`${this.backendUri}/search/skills`);
  }

  create(newSkill: SkillTo): Observable<SkillTo> {
    return this.http.post<SkillTo>(`${this.backendUri}/skills`, newSkill);
  }
}
