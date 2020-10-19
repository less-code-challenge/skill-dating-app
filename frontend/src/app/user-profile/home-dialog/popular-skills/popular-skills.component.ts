import { Component, Input } from '@angular/core';
import { SkillTo } from 'src/app/model/skill.to';

@Component({
  selector: 'sd-popular-skills',
  templateUrl: './popular-skills.component.html',
  styleUrls: ['./popular-skills.component.scss'],
})
export class PopularSkillsComponent {
  @Input()
  skills: SkillTo[];
}
