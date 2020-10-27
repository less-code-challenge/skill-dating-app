import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'sd-skill-filter',
  templateUrl: './skill-filter.component.html',
  styleUrls: ['./skill-filter.component.scss']
})
export class SkillFilterComponent {
  skillControls: FormControl[] = [];

  @Input()
  set skills(newSkills: string[]) {
    if (newSkills) {
      this.skillControls = newSkills.map(newSkill => new FormControl(newSkill));
    }
  }

  @Output()
  skillsChange = new EventEmitter<string[]>();

  @Output()
  backClick = new EventEmitter<void>();

  @Output()
  skillAddClick = new EventEmitter<void>();

  notifyOnBackClick(): void {
    this.backClick.emit();
  }

  removeSkill(skillToRemove: string): void {
    this.skillControls = this.skillControls.filter(skillControl => skillControl.value !== skillToRemove);
    this.skillsChange.emit(this.skillControls.map(skillControl => skillControl.value));
  }

  notifyOnSkillAddClick(): void {
    this.skillAddClick.emit();
  }
}
