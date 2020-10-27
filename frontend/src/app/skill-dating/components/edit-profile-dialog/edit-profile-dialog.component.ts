import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { userMyProfileOf, UserProfileTo } from '../../model/user-profile.to';
import { UserProfileClientService } from '../../services/user-profile.client';

const skillsParam = 'skills';

@Component({
  selector: 'sd-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
})
export class EditProfileDialogComponent {
  profile: any;

  formGroup: FormGroup;
  locations = [];
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly userProfileClientService: UserProfileClientService,
    private readonly fb: FormBuilder
  ) {
    const profile = activatedRoute.snapshot.data.profile;
    this.profile = userMyProfileOf(profile);
    this.formGroup = this.fb.group({
      username: [{ value: this.profile.username, disabled: true }],
      description: [this.profile.description],
      phoneNo: [this.profile.phoneNo],
      officeLocation: [this.profile.officeLocation],
      skills: [this.profile.skills],
    });

    this.locations = activatedRoute.snapshot.data.oficeLocations;

    activatedRoute.paramMap
      .pipe(
        filter((paramMap) => paramMap.has(skillsParam)),
        map((paramMap) => paramMap.get(skillsParam)),
        map(
          (commaSeparatedSkills) =>
            (commaSeparatedSkills && commaSeparatedSkills.split(',')) || []
        )
      )
      .subscribe((val) => this.formGroup.get('skills')?.setValue(val));
  }

  removeSkill(skill: string): void {
    const skills = this.formGroup.get('skills');
    skills?.setValue(skills.value.filter((val: string) => val !== skill));
  }

  save(): void {
    if (this.formGroup.valid) {
      const editedProfile = { ...this.profile, ...this.formGroup.value };
      this.userProfileClientService
        .updateUserProfile(editedProfile)
        .subscribe(() =>
          this.router.navigate(['../'], { relativeTo: this.activatedRoute })
        );
    }
  }
  goToAddSkill() {
    const skippedSkills = this.formGroup.get('skills')?.value || [];
    return this.router.navigate(['add-skill', { skippedSkills }], {
      relativeTo: this.activatedRoute,
    });
  }
}
