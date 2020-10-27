import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeDialogComponent } from './skill-dating/components/home-dialog/home-dialog.component';
import { SkillDatingModule } from './skill-dating/skill-dating.module';
import { SharedModule } from './shared/shared.module';
import { AfterSignInCallbackComponent } from './shared/security/after-sign-in-callback.component';
import { AuthGuard } from './shared/security/auth.guard';
import { LandingPageComponent } from './skill-dating/components/landing-page/landing-page.component';
import { RedirectToHomeGuard } from './shared/security/redirect-to-home.guard';
import { PopularSkillsResolver } from './skill-dating/components/home-dialog/popular-skills.resolver';
import { ProfileDialogComponent } from './skill-dating/components/profile-dialog/profile-dialog.component';
import { EditProfileDialogComponent } from './skill-dating/components/edit-profile-dialog/edit-profile-dialog.component';
import { UserProfileResolverService } from './shared/user-profile.resolver';
import { EditProfileResolverService } from './skill-dating/components/edit-profile-dialog/edit-profile.resolver';
import { SearchAllDialogComponent } from './skill-dating/components/search-all-dialog/search-all-dialog.component';
import { SearchProfilesDialogComponent } from './skill-dating/components/search-profiles-dialog/search-profiles-dialog.component';
import { SearchSkillsDialogComponent } from './skill-dating/components/search-skills-dialog/search-skills-dialog.component';
import { MyProfileResolverService } from './shared/my-profile.resolver';
import {
  NavigationService,
  paths,
} from './shared/navigation/navigation.service';
import { OfficeLocationsResolverService } from './skill-dating/components/edit-profile-dialog/office-locations.resolver';
import { AddProfileSkillsDialogComponent } from './skill-dating/components/add-profile-skills-dialog/add-profile-skills-dialog.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          component: LandingPageComponent,
          canActivate: [RedirectToHomeGuard],
        },
        {
          path: '',
          canActivate: [AuthGuard],
          resolve: { profile: MyProfileResolverService },
          children: [
            {
              path: 'after-sign-in-callback',
              component: AfterSignInCallbackComponent,
            },
            {
              path: 'home',
              component: HomeDialogComponent,
              resolve: {
                skills: PopularSkillsResolver,
              },
            },
            {
              path: 'my-profile/edit',
              component: EditProfileDialogComponent,
              resolve: {
                profile: EditProfileResolverService,
                oficeLocations: OfficeLocationsResolverService,
              },
            },
            {
              path: 'my-profile/edit/add-skill',
              component: AddProfileSkillsDialogComponent,
            },
            {
              path: 'my-profile',
              component: ProfileDialogComponent,
              resolve: { profile: MyProfileResolverService },
            },
            {
              path: 'profile/:username',
              component: ProfileDialogComponent,
              resolve: { profile: UserProfileResolverService },
              data: {
                externalProfile: true,
              },
            },
            {
              path: paths.searchAll,
              component: SearchAllDialogComponent,
            },
            {
              path: paths.searchProfiles,
              component: SearchProfilesDialogComponent,
            },
            {
              path: paths.searchSkills,
              component: SearchSkillsDialogComponent,
            },
          ],
        },
      ],
      { enableTracing: false }
    ),
    SharedModule.forRoot(),
    SkillDatingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(navigation: NavigationService) {
    navigation.keepLastPaths();
  }
}
