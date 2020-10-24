import {Component, Input} from '@angular/core';

@Component({
  selector: 'sd-skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.scss']
})
export class SkillItemComponent {
  @Input()
  value: string;
}
