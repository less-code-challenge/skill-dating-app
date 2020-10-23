import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeDialogComponent} from './components/home-dialog/home-dialog.component';
import {PopularSkillsComponent} from './components/home-dialog/popular-skills/popular-skills.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {EditProfileDialogComponent} from './components/edit-profile-dialog/edit-profile-dialog.component';
import {ProfileDialogComponent} from './components/profile-dialog/profile-dialog.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';

const dialogs = [
  LandingPageComponent,
  HomeDialogComponent,
  ProfileDialogComponent,
  EditProfileDialogComponent,
];

@NgModule({
  declarations: [...dialogs, PopularSkillsComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [...dialogs],
})
export class SkillDatingModule {
}
