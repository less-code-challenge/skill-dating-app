import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {HomeDialogComponent} from './user-profile/home-dialog/home-dialog.component';
import {UserProfileSearchDialogComponent} from './user-profile/user-profile-search-dialog/user-profile-search-dialog.component';
import {UserProfileModule} from './user-profile/user-profile.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeDialogComponent
      },
      {
        path: 'profiles',
        component: UserProfileSearchDialogComponent
      }
    ]),
    UserProfileModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
