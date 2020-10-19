import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeDialogComponent } from './user-profile/home-dialog/home-dialog.component';
import { UserProfileModule } from './user-profile/user-profile.module';
import { SharedModule } from './shared/shared.module';
import { AfterSignInCallbackComponent } from './shared/security/after-sign-in-callback.component';
import { AuthGuard } from './shared/security/auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RedirectToHomeGuard } from './shared/security/redirect-to-home.guard';
import { PopularSkillsResolver } from './user-profile/home-dialog/popular-skills.resolver';
import { RecentSearchesResolver } from './user-profile/home-dialog/recent-searches.resolver';
import { ProfileDialogComponent } from './user-profile/profile-dialog/profile-dialog.component';
import { EditProfileDialogComponent } from './user-profile/edit-profile-dialog/edit-profile-dialog.component';
import { ProfileResolverService } from './user-profile/profile-dialog/profile.resolver';
import { EditProfileResolverService } from './user-profile/edit-profile-dialog/edit-profile.resolver';

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
            skills: PopularSkillsResolver,
            searches: RecentSearchesResolver,
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
              resolve: { profile: EditProfileResolverService },
            },
            {
              path: 'profile',
              component: ProfileDialogComponent,
              resolve: { profile: ProfileResolverService },
            },
          ],
        },
      ],
      { enableTracing: true }
    ),
    SharedModule.forRoot(),
    UserProfileModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
