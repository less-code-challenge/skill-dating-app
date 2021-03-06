import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {first, map, pluck, startWith, switchMap} from 'rxjs/operators';
import {SearchService} from '../../services/search.service';
import {UserProfilesAndSkills, UserProfileTo} from '../../model/user-profile.to';
import {ResultViewType} from './result-view-types/result-view-types.component';
import {PopularSkillsTo} from '../../model/popular-skills.to';

const queryParam = 'query';

@Component({
  selector: 'sd-search-all-dialog',
  templateUrl: './search-all-dialog.component.html',
  styleUrls: ['./search-all-dialog.component.scss']
})
export class SearchAllDialogComponent {
  readonly query$: Observable<string>;
  readonly resultViewType$: Observable<ResultViewType>;
  readonly matchingResults$: Observable<UserProfilesAndSkills>;
  readonly skillPopularity: PopularSkillsTo;
  readonly showSearchResults$: Observable<boolean>;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly search: SearchService) {
    this.query$ = route.params.pipe(
      pluck(queryParam)
    );
    this.showSearchResults$ = this.query$.pipe(
      first(query => query?.trim().length > 0), // after a user types in a character close popular skills forever
      map(() => true),
      startWith(false) // initially do not show the result, but popular skills
    );
    this.matchingResults$ = this.query$.pipe(
      switchMap(query => query?.trim().length > 0 ? search.all(query) : of({userProfiles: [], skills: []}))
    );
    this.resultViewType$ = this.route.fragment
      .pipe(map((resultViewType: string) => {
        return ResultViewType[resultViewType as keyof typeof ResultViewType] || ResultViewType.All;
      }));
    this.skillPopularity = route.snapshot.data?.skillPopularity;
  }

  updateUrlParam(newQuery: string): Promise<boolean> {
    const params: Params = {};
    params[queryParam] = newQuery;
    return this.router.navigate([params], {relativeTo: this.route, preserveFragment: true, replaceUrl: true});
  }

  goToHomeDialog(): Promise<boolean> {
    return this.router.navigateByUrl('/home');
  }

  updateUrlFragment(resultViewType: ResultViewType): Promise<boolean> {
    return this.router.navigate(['.'],
      {relativeTo: this.route, fragment: ResultViewType[resultViewType], replaceUrl: true});
  }

  goToProfileDialogOf(userProfile: UserProfileTo): Promise<boolean> {
    return this.router.navigate(['/profile', userProfile.username]);
  }

  goToSearchProfilesDialog(skill: string): Promise<boolean> {
    return this.router.navigate(['/search/profiles', {skills: skill}]);
  }
}
