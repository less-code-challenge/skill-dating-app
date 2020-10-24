import {NgModule} from '@angular/core';
import {HomeDialogComponent} from './components/home-dialog/home-dialog.component';
import {PopularSkillsComponent} from './components/home-dialog/popular-skills/popular-skills.component';
import {SharedModule} from '../shared/shared.module';
import {EditProfileDialogComponent} from './components/edit-profile-dialog/edit-profile-dialog.component';
import {ProfileDialogComponent} from './components/profile-dialog/profile-dialog.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {SearchAllDialogComponent} from './components/search-all-dialog/search-all-dialog.component';
import {SearchSkillsDialogComponent} from './components/search-skills-dialog/search-skills-dialog.component';
import {SearchProfilesDialogComponent} from './components/search-profiles-dialog/search-profiles-dialog.component';

const dialogs = [
  LandingPageComponent,
  HomeDialogComponent,
  ProfileDialogComponent,
  EditProfileDialogComponent,
  SearchAllDialogComponent,
  SearchSkillsDialogComponent,
  SearchProfilesDialogComponent
];

@NgModule({
  declarations: [...dialogs, PopularSkillsComponent],
  imports: [SharedModule],
  exports: [...dialogs],
})
export class SkillDatingModule {
}
