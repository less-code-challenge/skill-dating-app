import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sd-profile-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
})
export class AddProfileSkillResultListComponent {
  @Input()
  query: string;
  @Input()
  newSkillAllowed: boolean;
  @Input()
  skills: string[];

  @Output()
  addSkillButtonClick = new EventEmitter<string>();
  @Output()
  addNewSkillButtonClick = new EventEmitter<string>();

  notifyOnSkillButtonClick(skill: string): void {
    this.addSkillButtonClick.emit(skill);
  }

  notifyOnNewSkillButtonClick(skill: string): void {
    this.addNewSkillButtonClick.emit(skill);
  }


}
