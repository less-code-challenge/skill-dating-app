import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PopularSkillsTo} from '../../../model/popular-skills.to';

@Component({
  selector: 'sd-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.scss']
})
export class SkillItemComponent {
  skillName: string;
  singleSkillPopularity: string;
  allSkillsPopularity: PopularSkillsTo;

  @Input()
  set value(newValue: string) {
    if (newValue) {
      this.skillName = newValue;
      this.updatePopularity();
    }
  }

  @Input()
  set skillPopularity(newSkillPopularity: PopularSkillsTo) {
    this.allSkillsPopularity = newSkillPopularity;
    this.updatePopularity();
  }

  @Input()
  addButton = false;

  @Output()
  addButtonClick = new EventEmitter<string>();

  notifyOnAddButtonClick(): void {
    this.addButtonClick.emit(this.skillName);
  }

  private updatePopularity(): void {
    if (this.skillName) {
      const skillPopularity = this.allSkillsPopularity?.[this.skillName];
      this.singleSkillPopularity = skillPopularity != null && skillPopularity > 1 ? `${skillPopularity} People`
        : `Less than 2 people`;
    }
  }
}
