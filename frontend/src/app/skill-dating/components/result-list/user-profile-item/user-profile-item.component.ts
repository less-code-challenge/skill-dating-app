import {Component, Input} from '@angular/core';
import {userProfileOf, UserProfileTo} from '../../../model/user-profile.to';

@Component({
  selector: 'sd-user-profile-item',
  templateUrl: './user-profile-item.component.html',
  styleUrls: ['./user-profile-item.component.scss']
})
export class UserProfileItemComponent {
  @Input()
  set value(newUserProfile: UserProfileTo) {
    if (newUserProfile) {
      const userProfile = userProfileOf(newUserProfile);
      this.initials = userProfile.getInitials();
      this.name = userProfile.getFullName();
      this.officeLocation = userProfile.getOfficeLocation();
    }
  }

  initials: string;
  name: string;
  officeLocation: string;
}
