import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SkillTo } from 'src/app/model/skill.to';


import { SkillClientService } from '../skill.client';
@Injectable({ providedIn: 'root' })
export class PopularSkillsResolver implements Resolve<Observable<SkillTo[]>> {
  constructor(private readonly skillClientService: SkillClientService) {}

  resolve(): Observable<SkillTo[]> {
    return this.skillClientService.findAll();
  }
}
