import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PopularSkillsTo} from '../../model/popular-skills.to';

@Component({
  selector: 'sd-recent-and-popular-skills',
  templateUrl: './recent-and-popular-skills.component.html',
  styleUrls: ['./recent-and-popular-skills.component.scss']
})
export class RecentAndPopularSkillsComponent {
  @Input()
  recentSkills: string[];

  @Output()
  skillClick = new EventEmitter<string>();

  mostPopularSkills: string[];

  skillPopularity: PopularSkillsTo;

  @Input()
  set popularSkills(newPopularSkills: PopularSkillsTo) {
    if (newPopularSkills) {
      this.skillPopularity = newPopularSkills;
      this.mostPopularSkills = Object.keys(newPopularSkills)
        .map(skillName => ({
          name: skillName,
          popularity: newPopularSkills[skillName]
        }))
        .sort((skill1, skill2) => skill1.popularity - skill2.popularity)
        .filter(skill => skill.popularity > 1)
        .slice(0, 3)
        .map(skill => skill.name);
    }
  }

  showRecentSkills(): boolean {
    return !!this.recentSkills?.length;
  }

  showPopularSkills(): boolean {
    return !!this.mostPopularSkills?.length;
  }

  notifyOnSkillClick(skillName: string): void {
    this.skillClick.emit(skillName);
  }
}
