import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {UserProfile} from '../../model/user-profile.to';
import {EditedProfileStoreService} from './edited-profile-store.service';
import {UserProfileService} from '../../services/user-profile.service';

const regExp = /^\+[0-9]{1,3}[0-9 \-()]{6,20}$/;

@Component({
  selector: 'sd-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
})
export class EditProfileDialogComponent implements OnDestroy {
  profile: UserProfile;
  destroy$ = new Subject<void>();
  formGroup: FormGroup;
  locations = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly userProfiles: UserProfileService,
    private readonly fb: FormBuilder,
    private readonly editedProfileStoreService: EditedProfileStoreService
  ) {
    this.locations = activatedRoute.snapshot.data.oficeLocations;
    this.profile = activatedRoute.snapshot.data.profile;
    editedProfileStoreService.init(this.profile);
    const formModel = editedProfileStoreService.get();

    this.formGroup = this.fb.group({
      description: [formModel?.description, Validators.maxLength(255)],
      phoneNo: [formModel?.phoneNo, Validators.pattern(regExp)],
      officeLocation: [formModel?.officeLocation],
      skills: [formModel?.skills],
    });

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
      this.userProfiles
        .update(editedProfile)
        .subscribe(() => {
          this.editedProfileStoreService.clear();
          this.router.navigate(['../'], {relativeTo: this.activatedRoute});
        });
    }
  }

  goToAddSkill(): Promise<boolean> {
    const selectedSkills = this.formGroup.get('skills')?.value || [];
    return this.router.navigate(['add-skill', {selectedSkills}], {
      relativeTo: this.activatedRoute,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): Promise<void> {
    return this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
    }).then(() => this.editedProfileStoreService.clear());
  }
}
