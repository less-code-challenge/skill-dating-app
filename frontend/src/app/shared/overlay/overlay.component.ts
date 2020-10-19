import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'ui-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayComponent {
  @Output()
  configureLater = new EventEmitter();
  @Output()
  configureProfile = new EventEmitter();
  configureProfileClick() {
    this.configureProfile.emit();
  }
  configureLaterClick() {
    this.configureLater.emit();
  }
}
