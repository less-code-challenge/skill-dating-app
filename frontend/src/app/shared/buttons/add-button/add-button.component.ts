import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'sd-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
  @HostBinding('attr.role')
  role = 'button';

  @HostBinding('attr.tabindex')
  tabindex = '0';
}
