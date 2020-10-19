import { Component, Input } from '@angular/core';
import { SkillTo } from 'src/app/model/skill.to';

@Component({
  selector: 'sd-recent-searches',
  templateUrl: './recent-searches.component.html',
  styleUrls: ['./recent-searches.component.scss'],
})
export class RecentSearchesComponent {
  @Input()
  searches: SkillTo[];
}
