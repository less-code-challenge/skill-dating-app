import { Location } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { userMyProfileOf } from '../../model/user-profile.to';

@Component({
  selector: 'sd-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent implements OnInit {
  profile: any;
  @HostBinding('class.external-profile') externalProfile = false;

  constructor(
    activatedRoute: ActivatedRoute,
    private readonly location: Location
  ) {
    this.externalProfile = activatedRoute.snapshot.data.externalProfile;
    const profile = activatedRoute.snapshot.data.profile;
    this.profile = userMyProfileOf(profile);
  }
  goToPrevPage(): void {
    this.location.back();
  }
  ngOnInit(): void {
    console.log();
  }
}
