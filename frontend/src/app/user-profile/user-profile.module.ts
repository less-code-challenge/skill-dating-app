import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeDialogComponent} from './home-dialog/home-dialog.component';
import {UserProfileSearchDialogComponent} from './user-profile-search-dialog/user-profile-search-dialog.component';

@NgModule({
  declarations: [HomeDialogComponent, UserProfileSearchDialogComponent],
  imports: [
    CommonModule
  ],
  exports: [HomeDialogComponent, UserProfileSearchDialogComponent]
})
export class UserProfileModule {
}
