import {Component, Input} from '@angular/core';
import {UserProfileTo} from '../../model/user-profile.to';
import {PopularSkillsTo} from '../../model/popular-skills.to';
import {ResultViewType} from '../search-all-dialog/search-all-dialog.component';

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

  showSkills(): boolean {
    return this.skills?.length > 0 && (this.show === ResultViewType.All || this.show === ResultViewType.Skills);
  }

  showUserProfiles(): boolean {
    return this.userProfiles?.length > 0 && (this.show === ResultViewType.All || this.show === ResultViewType.People);
  }
}
