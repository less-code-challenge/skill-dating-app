import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../services/search.service';
import {Observable, of} from 'rxjs';
import {map, pluck, switchMap} from 'rxjs/operators';
import {Location} from '@angular/common';
import {PopularSkillsTo} from '../../model/popular-skills.to';

const queryParam = 'query';
const skippedSkillsParam = 'skippedSkills';

@Component({
  selector: 'sd-search-skills-dialog',
  templateUrl: './search-skills-dialog.component.html',
  styleUrls: ['./search-skills-dialog.component.scss']
})
export class SearchSkillsDialogComponent {
  readonly query$: Observable<string>;
  readonly matchingSkills$: Observable<string[]>;
  readonly skillPopularity: PopularSkillsTo;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly search: SearchService,
              private readonly location: Location) {
    this.query$ = route.params.pipe(
      pluck(queryParam)
    );
    this.matchingSkills$ = route.params.pipe(
      switchMap(({skippedSkills: commaSeparatedSkippedSkills, query}) => {
        const skippedSkills = splitSkills(commaSeparatedSkippedSkills);
        return query?.length > 2 ?
          search.skills(query).pipe(
            map(skills => skippedSkills ? skills.filter(skill => skippedSkills.indexOf(skill) === -1) : skills)
          )
          : of([]);
      }),
    );

    this.skillPopularity = route.snapshot.data?.skillPopularity;
  }

  updateUrlParam(newQuery: string): Promise<boolean> {
    const params = {...this.route.snapshot.params};
    params[queryParam] = newQuery;
    return this.router.navigate([params], {relativeTo: this.route, replaceUrl: true});
  }

  goToPreviousDialog(): void {
    this.location.back();
  }

  goToSearchProfilesDialog(skill: string): Promise<boolean> {
    const skillsAlreadyInSearch = splitSkills(this.route.snapshot.paramMap.get(skippedSkillsParam));
    if (skill && skillsAlreadyInSearch.indexOf(skill) === -1) { // add skill to search
      skillsAlreadyInSearch.push(skill);
    }
    return this.router.navigate(['/search/profiles', {skills: skillsAlreadyInSearch.join(',')}]);
  }
}

function splitSkills(commaSeparatedSkills: string | undefined | null): string[] {
  return (commaSeparatedSkills && commaSeparatedSkills.split(',')) || [];
}
