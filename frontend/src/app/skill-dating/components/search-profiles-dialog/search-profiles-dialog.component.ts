import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map, pluck, switchMap, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {SearchService} from '../../services/search.service';
import {UserProfile, UserProfileTo} from '../../model/user-profile.to';
import {NavigationService} from '../../../shared/navigation/navigation.service';

const skillsParam = 'skills';

@Component({
  selector: 'sd-search-profiles-dialog',
  templateUrl: './search-profiles-dialog.component.html',
  styleUrls: ['./search-profiles-dialog.component.scss']
})
export class SearchProfilesDialogComponent {
  readonly skills$: Observable<string[]>;
  readonly matchingUserProfiles$: Observable<UserProfile[]>;
  noOfMatchingUserProfiles = 0;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly search: SearchService,
              private readonly navigation: NavigationService) {
    this.skills$ = route.params.pipe(
      pluck(skillsParam),
      map(commaSeparatedSkills => (commaSeparatedSkills && commaSeparatedSkills.split(',')) || []));
    this.matchingUserProfiles$ = this.skills$.pipe(
      switchMap(skills => {
        return skills?.length > 0 ? this.search.userProfilesBySkills(skills) : of([]);
      }),
      tap(matchingUserProfiles => this.noOfMatchingUserProfiles = matchingUserProfiles?.length ?? 0)
    );
  }

  updateUrlParam(newSkills: string[]): Promise<boolean> {
    const params: Params = {};
    params[skillsParam] = newSkills.join(',');
    return this.router.navigate(['.', {skills: newSkills.join(',')}],
      {relativeTo: this.route, replaceUrl: true});
  }

  goToSearchAllDialog(): Promise<boolean> {
    return this.navigation.goToLastUrlOfDialog('searchAll');
  }

  goToSearchSkillsDialog(): Promise<boolean> {
    const skippedSkills = this.route.snapshot.paramMap.get(skillsParam) || '';
    return this.router.navigate(['/search/skills', {skippedSkills}]);
  }

  goToProfileDialogOf(userProfile: UserProfileTo): Promise<boolean> {
    return this.router.navigate(['/profile', userProfile.username]);
  }

  getMessageOnPeopleFound(): string {
    if (this.noOfMatchingUserProfiles === 0) {
      return 'No People Found';
    } else if (this.noOfMatchingUserProfiles === 1) {
      return 'Found 1 Person';
    } else if (this.noOfMatchingUserProfiles > 1) {
      return `Found ${this.noOfMatchingUserProfiles} People`;
    }
    return '';
  }
}
