import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Navigation, UrlTree } from '@angular/router';
import { userMyProfileOf } from '../../model/user-profile.to';

@Component({
  selector: 'sd-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent implements OnInit {
  profile: any;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location
  ) {
    const profile = activatedRoute.snapshot.data.profile;
    this.profile = userMyProfileOf(profile);
  }
  goToPrevPage() {
    this.location.back();
  }
  ngOnInit(): void {}
}
