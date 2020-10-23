import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { empty, Observable } from 'rxjs';

import { UserProfileTo } from '../../model/user-profile.to';

import { SkillClientService } from '../../services/skill.client';
@Injectable({ providedIn: 'root' })
export class EditProfileResolverService
  implements Resolve<Observable<UserProfileTo>> {
  constructor(private readonly skillClientService: SkillClientService) {}

  resolve(): Observable<UserProfileTo> {
    // return this.skillClientService.findAll();
    return empty();
  }
}
