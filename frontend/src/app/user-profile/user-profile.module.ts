import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeDialogComponent } from './home-dialog/home-dialog.component';
import { RecentSearchesComponent } from './home-dialog/recent-searches/recent-searches.component';
import { PopularSkillsComponent } from './home-dialog/popular-skills/popular-skills.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

const dialogs = [
  HomeDialogComponent,
  ProfileDialogComponent,
  EditProfileDialogComponent,
];
@NgModule({
  declarations: [...dialogs, RecentSearchesComponent, PopularSkillsComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [...dialogs],
})
export class UserProfileModule {}
