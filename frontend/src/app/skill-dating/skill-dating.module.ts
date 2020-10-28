import { NgModule } from '@angular/core';
import { HomeDialogComponent } from './components/home-dialog/home-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { EditProfileDialogComponent } from './components/edit-profile-dialog/edit-profile-dialog.component';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SearchAllDialogComponent } from './components/search-all-dialog/search-all-dialog.component';
import { SearchSkillsDialogComponent } from './components/search-skills-dialog/search-skills-dialog.component';
import { SearchProfilesDialogComponent } from './components/search-profiles-dialog/search-profiles-dialog.component';
import { ResultViewTypesComponent } from './components/search-all-dialog/result-view-types/result-view-types.component';
import { ResultListComponent } from './components/result-list/result-list.component';
import { SkillItemComponent } from './components/result-list/skill-item/skill-item.component';
import { UserProfileItemComponent } from './components/result-list/user-profile-item/user-profile-item.component';
import { SkillFilterComponent } from './components/search-profiles-dialog/skill-filter/skill-filter.component';
import { AddProfileSkillsDialogComponent } from './components/add-profile-skills-dialog/add-profile-skills-dialog.component';
import { AddProfileSkillResultListComponent } from './components/add-profile-skills-dialog/result-list/result-list.component';
import { ProfileSkillItemComponent } from './components/add-profile-skills-dialog/result-list/skill-item/skill-item.component';
import { ProfileNewSkillItemComponent } from './components/add-profile-skills-dialog/result-list/new-skill-item/new-skill-item.component';
import { SkillListComponent } from './components/add-profile-skills-dialog/result-list/skill-list/skill-list.component';
import { MyProfileDialogComponent } from './components/my-profile-dialog/my-profile-dialog.component';
import { RecentAndPopularSkillsComponent } from './components/recent-and-popular-skills/recent-and-popular-skills.component';

const dialogs = [
  LandingPageComponent,
  HomeDialogComponent,
  ProfileDialogComponent,
  MyProfileDialogComponent,
  EditProfileDialogComponent,
  SearchAllDialogComponent,
  SearchSkillsDialogComponent,
  AddProfileSkillsDialogComponent,
  SearchProfilesDialogComponent,
];

@NgModule({
  declarations: [
    ...dialogs,
    ResultViewTypesComponent,
    ResultListComponent,
    SkillItemComponent,
    UserProfileItemComponent,
    SkillFilterComponent,
    AddProfileSkillResultListComponent,
    ProfileSkillItemComponent,
    ProfileNewSkillItemComponent,
    SkillListComponent,
    RecentAndPopularSkillsComponent
  ],
  imports: [SharedModule],
  exports: [...dialogs],
})
export class SkillDatingModule {}
