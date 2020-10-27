import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map, pluck, switchMap, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {SearchService} from '../../services/search.service';
import {UserProfileTo} from '../../model/user-profile.to';
import {Location} from '@angular/common';
import {NavigationService} from '../../../shared/navigation/navigation.service';

const skillsParam = 'skills';

@Component({
  selector: 'sd-search-profiles-dialog',
  templateUrl: './search-profiles-dialog.component.html',
  styleUrls: ['./search-profiles-dialog.component.scss']
})
export class SearchProfilesDialogComponent {
  readonly skills$: Observable<string[]>;
  readonly matchingUserProfiles$: Observable<UserProfileTo[]>;

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
      tap(prof => console.log(prof))
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
}
