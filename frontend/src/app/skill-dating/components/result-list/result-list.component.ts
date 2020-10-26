import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UserProfileTo} from '../../model/user-profile.to';
import {PopularSkillsTo} from '../../model/popular-skills.to';
import {ResultViewType} from '../search-all-dialog/result-view-types/result-view-types.component';

@Component({
  selector: 'sd-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent {
  @Input()
  show: ResultViewType = ResultViewType.All;

  @Input()
  skills: string[];

  @Input()
  popularSkills: PopularSkillsTo[];

  @Input()
  userProfiles: UserProfileTo[];

  @Output()
  userProfileClick = new EventEmitter<UserProfileTo>();

  @Output()
  skillClick = new EventEmitter<string>();

  showSkills(): boolean {
    return this.skills?.length > 0 && (this.show === ResultViewType.All || this.show === ResultViewType.Skills);
  }

  showUserProfiles(): boolean {
    return this.userProfiles?.length > 0 && (this.show === ResultViewType.All || this.show === ResultViewType.People);
  }

  notifyOnUserProfileClick(profile: UserProfileTo): void {
    this.userProfileClick.emit(profile);
  }

  notifyOnSkillClick(skill: string): void {
    this.skillClick.emit(skill);
  }
}