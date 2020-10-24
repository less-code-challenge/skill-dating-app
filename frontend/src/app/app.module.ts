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
import {ProfileDialogComponent} from './skill-dating/components/profile-dialog/profile-dialog.component';
import {EditProfileDialogComponent} from './skill-dating/components/edit-profile-dialog/edit-profile-dialog.component';
import {ProfileResolverService} from './skill-dating/components/profile-dialog/profile.resolver';
import {EditProfileResolverService} from './skill-dating/components/edit-profile-dialog/edit-profile.resolver';
import {SearchAllDialogComponent} from './skill-dating/components/search-all-dialog/search-all-dialog.component';
import {SearchProfilesDialogComponent} from './skill-dating/components/search-profiles-dialog/search-profiles-dialog.component';
import {SearchSkillsDialogComponent} from './skill-dating/components/search-skills-dialog/search-skills-dialog.component';

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
          path: 'home',
          component: HomeDialogComponent,
          resolve: {
            skills: PopularSkillsResolver
          },
        },
        {
          path: 'after-sign-in-callback',
          component: AfterSignInCallbackComponent,
        },
        {
          path: '',
          canActivate: [AuthGuard],
          children: [
            {
              path: 'profile/edit',
              component: EditProfileDialogComponent,
              resolve: {profile: EditProfileResolverService},
            },
            {
              path: 'profile',
              component: ProfileDialogComponent,
              resolve: {profile: ProfileResolverService},
            },
            {
              path: 'search',
              component: SearchAllDialogComponent
            },
            {
              path: 'search/profiles',
              component: SearchProfilesDialogComponent
            },
            {
              path: 'search/skills',
              component: SearchSkillsDialogComponent
            }
          ],
        },
      ],
      {enableTracing: true}
    ),
    SharedModule.forRoot(),
    SkillDatingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
