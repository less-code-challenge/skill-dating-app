import { Component, OnInit } from '@angular/core';
import {SkillService} from '../skill.service';
import {Observable} from 'rxjs';
import {SkillTo} from '../model';

@Component({
  selector: 'sd-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.scss']
})
export class HomeDialogComponent {
  readonly skills$: Observable<SkillTo[]>;

  constructor(skills: SkillService) {
    this.skills$ = skills.findAll();
  }
}
