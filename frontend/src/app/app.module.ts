import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {HomeDialogComponent} from './skill-dating/components/home-dialog/home-dialog.component';
import {SkillDatingModule} from './skill-dating/skill-dating.module';
import {SharedModule} from './shared/shared.module';
import {AfterSignInCallbackComponent} from './shared/security/after-sign-in-callback.component';
import {AuthGuard} from './shared/security/auth.guard';
import {LandingPageComponent} from './skill-dating/components/landing-page/landing-page.component';
import {RedirectToHomeGuard} from './shared/security/redirect-to-home.guard';
import {PopularSkillsResolver} from './skill-dating/components/home-dialog/popular-skills.resolver';
import {EditProfileDialogComponent} from './skill-dating/components/edit-profile-dialog/edit-profile-dialog.component';
import {EditProfileResolverService} from './skill-dating/components/edit-profile-dialog/edit-profile.resolver';
import {SearchAllDialogComponent} from './skill-dating/components/search-all-dialog/search-all-dialog.component';
import {SearchProfilesDialogComponent} from './skill-dating/components/search-profiles-dialog/search-profiles-dialog.component';
import {SearchSkillsDialogComponent} from './skill-dating/components/search-skills-dialog/search-skills-dialog.component';
import {MyProfileResolverService} from './shared/resolvers/my-profile.resolver';
import {NavigationService, paths,} from './shared/navigation/navigation.service';
import {AddProfileSkillsDialogComponent} from './skill-dating/components/add-profile-skills-dialog/add-profile-skills-dialog.component';
import {MyProfileDialogComponent} from './skill-dating/components/my-profile-dialog/my-profile-dialog.component';
import {OfficeLocationsResolverService} from './shared/resolvers/office-locations.resolver';
import {UserProfileResolverService} from './shared/resolvers/user-profile.resolver';
import {ProfileDialogComponent} from './skill-dating/components/profile-dialog/profile-dialog.component';
import {UserResolver} from './shared/resolvers/user.resolver';

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
          resolve: {profile: MyProfileResolverService},
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
                user: UserResolver
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
              component: MyProfileDialogComponent,
              resolve: {profile: MyProfileResolverService},
            },
            {
              path: 'profile/:username',
              component: ProfileDialogComponent,
              resolve: {profile: UserProfileResolverService},
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
              resolve: {
                skillPopularity: PopularSkillsResolver
              }
            },
          ],
        },
      ],
      {enableTracing: false}
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
