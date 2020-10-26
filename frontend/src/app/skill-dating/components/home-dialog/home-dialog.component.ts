import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../../services/skill.service';
import { PopularSkillsTo } from '../../model/popular-skills.to';
import { of } from 'rxjs';
import { SecurityService } from 'src/app/shared/security/security.service';
import { map } from 'rxjs/operators';
import { UserProfileClientService } from '../../services/user-profile.client';
import { initialUserProfileOf } from '../../model/user-profile.to';

@Component({
  selector: 'sd-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.scss'],
})
export class HomeDialogComponent {
  overlayShown = false;

  skills: PopularSkillsTo;
  movingTop = false;

  constructor(
    activatedRoute: ActivatedRoute,
    skills: SkillService,
    private readonly security: SecurityService,
    private readonly userProfileClientService: UserProfileClientService,
    private readonly router: Router
  ) {
    this.skills = activatedRoute.snapshot.data.skills;
    skills.findAll().subscribe((allSkills) => console.log(allSkills));
  }

  goToTopSearch(): void {
    this.movingTop = true;
    setTimeout(() => {
      this.router.navigateByUrl('/search');
    }, 500);
  }

  configureLater(): void {
    this.security.username$.pipe().subscribe((email) => {
      const initialProfile = initialUserProfileOf(email);
      this.userProfileClientService.createUserProfile(initialProfile);
      this.overlayShown = false;
    });
  }

  goToConfigureProfile(): void {
    this.router.navigate(['profile']);
  }
}
