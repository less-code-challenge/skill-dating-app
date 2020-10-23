import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {SkillClientService} from '../../services/skill.client';
import {PopularSkillsTo} from '../../model/popular-skills.to';

@Injectable({providedIn: 'root'})
export class PopularSkillsResolver implements Resolve<Observable<PopularSkillsTo>> {
  constructor(private readonly skillClientService: SkillClientService) {
  }

  resolve(): Observable<PopularSkillsTo> {
    return this.skillClientService.findAll();
  }
}
