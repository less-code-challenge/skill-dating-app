import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PopularSkillsTo } from '../../model/popular-skills.to';
import { SkillService } from '../../services/skill.service';

@Injectable({ providedIn: 'root' })
export class PopularSkillsResolver
  implements Resolve<Observable<PopularSkillsTo>> {
  constructor(private readonly skillService: SkillService) {}

  resolve(): Observable<PopularSkillsTo> {
    return this.skillService.findAll2();
  }
}
