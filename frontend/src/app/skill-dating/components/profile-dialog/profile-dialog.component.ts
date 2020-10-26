import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  userMyProfileOf,
} from '../../model/user-profile.to';

@Component({
  selector: 'sd-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent implements OnInit {
  profile : any;

  constructor(private readonly activatedRoute: ActivatedRoute) {
    const profile = activatedRoute.snapshot.data.profile;
    this.profile = userMyProfileOf(profile);
  }

  ngOnInit(): void {}
}
