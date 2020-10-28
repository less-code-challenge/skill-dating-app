import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'sd-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {
  @HostBinding('attr.role')
  role = 'button';

  @HostBinding('attr.tabindex')
  tabindex = '0';
}
