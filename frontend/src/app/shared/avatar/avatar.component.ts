import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'ui-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input()
  initial: string;
  @Input()
  big: boolean;
}
