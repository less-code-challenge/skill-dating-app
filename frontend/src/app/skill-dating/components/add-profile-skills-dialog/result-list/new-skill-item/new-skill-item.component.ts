import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'sd-profile-new-skill-item',
  templateUrl: './new-skill-item.component.html',
  styleUrls: ['./new-skill-item.component.scss']
})
export class ProfileNewSkillItemComponent {
  @Input()
  value: string;

  @Input()
  addButton = false;

  @Output()
  addButtonClick = new EventEmitter<string>();

  notifyOnAddButtonClick(): void {
    this.addButtonClick.emit(this.value);
  }
}
