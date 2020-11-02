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
      if (skillPopularity && skillPopularity > 0) {
        this.singleSkillPopularity = skillPopularity === 1 ? '1 person' : `${skillPopularity} people`;
      } else {
        this.singleSkillPopularity = 'No people';
      }
    }
  }
}
