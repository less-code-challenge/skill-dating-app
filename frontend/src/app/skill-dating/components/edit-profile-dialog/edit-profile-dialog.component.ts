import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { userMyProfileOf } from '../../model/user-profile.to';

@Component({
  selector: 'sd-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
})
export class EditProfileDialogComponent implements OnInit {
  profile: any;

  formGroup: FormGroup = this.fb.group({
    firstname: [],
    lastname: [],
    username: [],
    description: [],
    position: [],
    phoneNo: [],
    officeLocation: [],
    skills: [],
  });

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder
  ) {
    const profile = activatedRoute.snapshot.data.profile;
    this.profile = userMyProfileOf(profile);
  }

  ngOnInit(): void {}
  save(){
    
  }
}
