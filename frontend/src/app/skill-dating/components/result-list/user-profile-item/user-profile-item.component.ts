import {Component, Input} from '@angular/core';
import {toUserProfile, UserProfile} from '../../../model/user-profile.to';

@Component({
  selector: 'sd-user-profile-item',
  templateUrl: './user-profile-item.component.html',
  styleUrls: ['./user-profile-item.component.scss']
})
export class UserProfileItemComponent {
  @Input()
  set value(newUserProfile: UserProfile) {
    if (newUserProfile) {
      const userProfile = toUserProfile(newUserProfile);
      this.initials = userProfile.initials;
      this.name = `${userProfile.firstName} ${userProfile.lastName}`;
      const officeLocation = userProfile.officeLocation;
      this.officeLocation = officeLocation ? `${officeLocation.country}, ${officeLocation.office}` : '';
    }
  }

  initials: string;
  name: string;
  officeLocation: string;
}
