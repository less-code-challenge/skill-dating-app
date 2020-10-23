import {Component, Input} from '@angular/core';
import {PopularSkillsTo} from '../../../model/popular-skills.to';

@Component({
  selector: 'sd-popular-skills',
  templateUrl: './popular-skills.component.html',
  styleUrls: ['./popular-skills.component.scss'],
})
export class PopularSkillsComponent {
  skills: { name: string, popularity: number }[] = [];

  @Input('value')
  set value(newPopularSkills: PopularSkillsTo) {
    if (newPopularSkills) {
      this.skills = Object.keys(newPopularSkills).map(skillName => ({
        name: skillName,
        popularity: newPopularSkills[skillName]
      }));
    }
  }
}
