import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, pluck, switchMap, tap} from 'rxjs/operators';
import {SearchService, UserProfilesAndSkills} from '../../services/search.service';

const queryParam = 'query';

export enum ResultViewType {
  All,
  Skills,
  People
}

@Component({
  selector: 'sd-search-all-dialog',
  templateUrl: './search-all-dialog.component.html',
  styleUrls: ['./search-all-dialog.component.scss']
})
export class SearchAllDialogComponent {
  query$: Observable<string>;
  resultViewType$: Observable<ResultViewType>;
  matchingResults$: Observable<UserProfilesAndSkills>;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly search: SearchService) {
    this.query$ = route.params.pipe(
      pluck(queryParam),
      tap(query => console.log(query))
    );
    this.matchingResults$ = this.query$.pipe(
      switchMap(query => query?.length > 2 ? search.all(query) : of({userProfiles: [], skills: []})),
      tap(() => console.log(route.snapshot.fragment))
    );
    this.resultViewType$ = this.route.fragment
      .pipe(map((resultViewType: string) => {
        return ResultViewType[resultViewType as keyof typeof ResultViewType] || ResultViewType.All;
      }));
  }

  updateUrlParam(newQuery: string): void {
    const params: Params = {};
    params[queryParam] = newQuery;
    this.router.navigate([params], {relativeTo: this.route, preserveFragment: true});
  }

  goToHomeDialog(): void {
    this.router.navigateByUrl('/home');
  }

  updateUrlFragment(resultViewType: ResultViewType): Promise<boolean> {
    return this.router.navigate(['.'],
      {relativeTo: this.route, fragment: ResultViewType[resultViewType]});
  }
}
