import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Observable, of } from 'rxjs';
import {
  map,
  pluck,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Location } from '@angular/common';
import { SkillService } from '../../services/skill.service';

const queryParam = 'query';
const skippedSkillsParam = 'skippedSkills';

@Component({
  selector: 'sd-add-profile-skills-dialog',
  templateUrl: './add-profile-skills-dialog.component.html',
  styleUrls: ['./add-profile-skills-dialog.component.scss'],
})
export class AddProfileSkillsDialogComponent {
  readonly query$: Observable<string>;
  readonly newSkill$: Observable<string | null>;
  readonly matchingSkills$: Observable<string[]>;
  readonly currentSkills: string[] = [];
  constructor(
    private readonly route: ActivatedRoute,
    private readonly skillService: SkillService,
    private readonly router: Router,
    search: SearchService,
    private readonly location: Location
  ) {
    this.query$ = route.params.pipe(pluck(queryParam));

    this.matchingSkills$ = route.params.pipe(
      switchMap(({ skippedSkills: commaSeparatedSkippedSkills, query }) => {
        const skippedSkills = splitSkills(commaSeparatedSkippedSkills);

        this.currentSkills.length = 0;
        skippedSkills.forEach((elem) => this.currentSkills.push(elem));

        return query?.length > 2
          ? search
              .skills(query)
              .pipe(
                map((skills) =>
                  skippedSkills
                    ? skills.filter(
                        (skill) => skippedSkills.indexOf(skill) === -1
                      )
                    : skills
                )
              )
          : of([]);
      })
    );
    this.newSkill$ = this.matchingSkills$.pipe(
      withLatestFrom(this.query$),
      map(([list, query]) =>
        query?.length > 2 &&
        notContainingLowercased(this.currentSkills, query) &&
        notContainingLowercased(list, query)
          ? query
          : null
      )
    );
  }

  addSelectedSkills(): void {
    this.router.navigate(['../', { skills: this.currentSkills.join(',') }], {
      relativeTo: this.route,
    });
  }

  addSkillToList(skill: string): void {
    this.updateUrlParamSkills([...this.currentSkills, skill]);
  }
  addNewSkillToList(skill: string): void {
    this.skillService.createSkill({ name: skill }).subscribe((savedSkill) => {
      this.updateUrlParamSkills([...this.currentSkills, savedSkill.name]);
    });
  }
  removeSkill(skill: string): void {
    this.updateUrlParamSkills(
      this.currentSkills.filter((val) => val !== skill)
    );
  }
  updateUrlParam(newQuery: string): Promise<boolean> {
    const params = { ...this.route.snapshot.params };
    params[queryParam] = newQuery;
    return this.router.navigate([params], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  updateUrlParamSkills(newSkills: string[]): Promise<boolean> {
    const params = { ...this.route.snapshot.params };
    params[skippedSkillsParam] = newSkills.join(',');
    return this.router.navigate([params], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  goToPreviousDialog(): void {
    this.location.back();
  }
}
function notContainingLowercased(list: string[], elem: string): boolean {
  const elemLowercase = elem.toLowerCase();
  return list.filter((el) => el.toLowerCase() === elemLowercase).length === 0;
}
function splitSkills(
  commaSeparatedSkills: string | undefined | null
): string[] {
  return (commaSeparatedSkills && commaSeparatedSkills.split(',')) || [];
}
