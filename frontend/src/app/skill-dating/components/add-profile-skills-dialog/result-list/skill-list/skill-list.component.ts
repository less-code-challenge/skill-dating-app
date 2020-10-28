import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sd-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss'],
})
export class SkillListComponent {
  @Input()
  dark: boolean;
  @Input()
  disabled: boolean;

  @Input()
  skills: string[] = [];

  @Output()
  removeSkillClick = new EventEmitter<string>();

  removeSkill(skill: string): void {
    this.removeSkillClick.emit(skill);
  }
}
