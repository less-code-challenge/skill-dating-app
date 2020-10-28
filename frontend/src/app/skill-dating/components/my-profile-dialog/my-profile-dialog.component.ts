import { Location } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/shared/security/security.service';
import { userMyProfileOf } from '../../model/user-profile.to';

@Component({
  selector: 'sd-my-profile-dialog',
  templateUrl: './my-profile-dialog.component.html',
  styleUrls: ['./my-profile-dialog.component.scss'],
})
export class MyProfileDialogComponent implements OnInit {
  profile: any;
  constructor(
    activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly security: SecurityService,
    private readonly router: Router,
  ) {
    const profile = activatedRoute.snapshot.data.profile;
    this.profile = userMyProfileOf(profile);
  }
  goToPrevPage(): void {
    this.router.navigate(['/home']);
  }
  ngOnInit(): void {
    console.log();
  }
  
  logOut(): void {
    this.security.signOut();
  }
}
