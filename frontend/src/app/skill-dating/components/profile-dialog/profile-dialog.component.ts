import { Location } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/shared/security/security.service';
import { userMyProfileOf } from '../../model/user-profile.to';

@Component({
  selector: 'sd-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent {
  profile: any;

  constructor(
    activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly security: SecurityService
  ) {
    this.profile = activatedRoute.snapshot.data.profile;
  }
  goToPrevPage(): void {
    this.location.back();
  }

  logOut(): void {
    this.security.signOut();
  }
}
