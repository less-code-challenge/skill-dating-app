import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../../services/skill.service';
import { PopularSkillsTo } from '../../model/popular-skills.to';
import { Observable } from 'rxjs';
import { SecurityService } from 'src/app/shared/security/security.service';
import { map, switchMap } from 'rxjs/operators';
import { UserProfileClientService } from '../../services/user-profile.client';
import {
  initialUserProfileOf, UserProfile,
  UserProfileTo,
} from '../../model/user-profile.to';
import { User } from '../../../shared/security/user';

@Component({
  selector: 'sd-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.scss'],
})
export class HomeDialogComponent {
  readonly popularSkills: PopularSkillsTo;
  readonly profile: UserProfile;
  overlayShown = false;
  movingTop = false;

  constructor(
    activatedRoute: ActivatedRoute,
    skills: SkillService,
    private readonly security: SecurityService,
    private readonly userProfileClientService: UserProfileClientService,
    private readonly router: Router
  ) {
    this.popularSkills = activatedRoute.snapshot.data.skills;
    this.profile = activatedRoute.snapshot.data.profile;
    if (!this.profile || !this.profile.skills?.length) {
      this.overlayShown = true;
    }
  }

  goToTopSearch(): void {
    this.movingTop = true;
    setTimeout(() => {
      this.router.navigateByUrl('/search');
    }, 500);
  }

  configureLater(): void {
    if (!this.profile) {
      this.createInitialProfile().subscribe(() => (this.overlayShown = false));
    } else {
      this.overlayShown = false;
    }
  }

  goToSearchProfilesDialog(skill: string): Promise<boolean> {
    return this.router.navigate(['/search/profiles', { skills: skill }]);
  }

  goToConfigureProfile(): void {
    if (!this.profile) {
      this.createInitialProfile().subscribe(() =>
        this.router.navigate(['my-profile'])
      );
    } else {
      this.router.navigate(['my-profile']);
    }
  }

  private createInitialProfile(): Observable<UserProfileTo> {
    return this.security.username$.pipe(
      map((email) => initialUserProfileOf(email)),
      switchMap((initialProfile) =>
        this.userProfileClientService.createUserProfile(initialProfile)
      )
    );
  }
}
