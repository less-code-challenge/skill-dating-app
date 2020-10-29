import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import { userMyProfileOf, UserProfileTo } from '../../model/user-profile.to';
import { UserProfileClientService } from '../../services/user-profile.client';
import { EditedProfileStoreService } from './edited-profile-store.service';

const skillsParam = 'skills';

const regExp = /^\+[0-9]{1,3}[0-9 \-()]{6,20}$/;
@Component({
  selector: 'sd-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
})
export class EditProfileDialogComponent implements OnDestroy {
  profile: any;
  destroy$ = new Subject<void>();
  formGroup: FormGroup;
  locations = [];
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly userProfileClientService: UserProfileClientService,
    private readonly fb: FormBuilder,
    private readonly editedProfileStoreService: EditedProfileStoreService
  ) {
    this.locations = activatedRoute.snapshot.data.oficeLocations;
    const profile =
      editedProfileStoreService.editedUserProfile.value ||
      activatedRoute.snapshot.data.profile;

    this.profile = userMyProfileOf(profile);

    this.formGroup = this.fb.group({
      username: [{ value: this.profile.username, disabled: true }],
      description: [this.profile.description],
      phoneNo: [this.profile.phoneNo, Validators.pattern(regExp)],
      officeLocation: [this.profile.officeLocation],
      skills: [this.profile.skills],
    });

    activatedRoute.paramMap
      .pipe(
        filter((paramMap) => paramMap.has(skillsParam)),
        map((paramMap) => paramMap.get(skillsParam)),
        map(
          (commaSeparatedSkills) =>
            (commaSeparatedSkills && commaSeparatedSkills.split(',')) || []
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((val) => this.formGroup.get('skills')?.setValue(val));
    this.formGroup.valueChanges
      .pipe(
        map(() => this.formGroup.getRawValue()),
        takeUntil(this.destroy$)
      )
      .subscribe((changes) =>
        this.editedProfileStoreService.profileChanged(changes)
      );
  }

  removeSkill(skill: string): void {
    const skills = this.formGroup.get('skills');
    skills?.setValue(skills.value.filter((val: string) => val !== skill));
  }

  save(): void {
    if (this.formGroup.valid) {
      const editedProfile = {
        username: this.profile.username,
        ...this.formGroup.value,
      };
      this.userProfileClientService
        .updateUserProfile(editedProfile)
        .subscribe(() => {
          this.editedProfileStoreService.clear();
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        });
    }
  }
  goToAddSkill(): Promise<boolean> {
    const skippedSkills = this.formGroup.get('skills')?.value || [];
    return this.router.navigate(['add-skill', { skippedSkills }], {
      relativeTo: this.activatedRoute,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
