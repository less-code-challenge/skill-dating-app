import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/shared/security/security.service';
import { userMyProfileOf } from '../../model/user-profile.to';

@Component({
  selector: 'sd-my-profile-dialog',
  templateUrl: './my-profile-dialog.component.html',
  styleUrls: ['./my-profile-dialog.component.scss'],
})
export class MyProfileDialogComponent {
  profile: any;
  constructor(
    activatedRoute: ActivatedRoute,
    private readonly security: SecurityService,
    private readonly router: Router
  ) {
    const profile = activatedRoute.snapshot.data.profile;
    this.profile = userMyProfileOf(profile);
  }
  goToPrevPage(): void {
    this.router.navigate(['/home']);
  }

  logOut(): void {
    this.security.signOut();
  }
}
