import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { userMyProfileOf } from '../../model/user-profile.to';
import { UserProfileClientService } from '../../services/user-profile.client';

@Component({
  selector: 'sd-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
})
export class EditProfileDialogComponent implements OnInit {
  profile: any;

  formGroup: FormGroup;
  locations = [];
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly userProfileClientService: UserProfileClientService,
    private readonly fb: FormBuilder
  ) {
    const profile = activatedRoute.snapshot.data.profile;
    this.profile = userMyProfileOf(profile);
    this.formGroup = this.fb.group({
      username: this.profile.username,
      description: this.profile.description,
      phoneNo: this.profile.phoneNo,
      officeLocation: this.profile.officeLocation,
      skills: this.profile.skills,
    });

    this.locations = activatedRoute.snapshot.data.oficeLocations;
  }

  ngOnInit(): void {}
  save(): void {
    if (this.formGroup.valid) {
      const editedProfile = this.formGroup.value;
      this.userProfileClientService
        .updateUserProfile(editedProfile)
        .subscribe(() => this.location.back());
    }
  }
}
