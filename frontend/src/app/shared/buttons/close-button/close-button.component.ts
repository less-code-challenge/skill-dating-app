import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'sd-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss']
})
export class CloseButtonComponent {
  @HostBinding('attr.role')
  role = 'button';

  @HostBinding('attr.tabindex')
  tabindex = '0';
}
