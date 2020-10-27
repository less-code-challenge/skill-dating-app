import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'sd-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.scss']
})
export class SkillItemComponent {
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
