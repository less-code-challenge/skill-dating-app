import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from '../../services/search.service';
import {Observable, of, OperatorFunction} from 'rxjs';
import {map, pluck, switchMap} from 'rxjs/operators';
import {Location} from '@angular/common';
import {SkillService} from '../../services/skill.service';
import {EditedProfileStoreService} from '../edit-profile-dialog/edited-profile-store.service';
import {splitSkills} from '../component-utils';

const queryParam = 'query';
const selectedSkillsParam = 'selectedSkills';

interface MatchingSkillsAndNewSkill {
  matchingSkills: string[];
  newSkill?: string;
}

@Component({
  selector: 'sd-add-profile-skills-dialog',
  templateUrl: './add-profile-skills-dialog.component.html',
  styleUrls: ['./add-profile-skills-dialog.component.scss'],
})
export class AddProfileSkillsDialogComponent {
  readonly query$: Observable<string>;
  readonly selectedSkills$: Observable<string[]>;
  readonly matchingSkillsAndNewSkill$: Observable<MatchingSkillsAndNewSkill>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly skills: SkillService,
    private readonly router: Router,
    search: SearchService,
    private readonly location: Location,
    private readonly editedProfileStore: EditedProfileStoreService
  ) {
    this.query$ = route.params.pipe(pluck(queryParam));

    this.selectedSkills$ = route.params.pipe(
      pluck(selectedSkillsParam),
      map(commaSeparatedSelectedSkills => splitSkills(commaSeparatedSelectedSkills))
    );

    this.matchingSkillsAndNewSkill$ = route.params.pipe(
      switchMap(({selectedSkills: commaSeparatedSelectedSkills, query}) => {
        const selectedSkills = splitSkills(commaSeparatedSelectedSkills);
        const skillQuery = query?.trim();
        if (skillQuery?.length > 0) {
          return search.skills(skillQuery)
            .pipe(filterOutSkillsAndCheckForNewSkillCandidate(selectedSkills, skillQuery));
        } else {
          return of({
            matchingSkills: []
          });
        }

        function filterOutSkillsAndCheckForNewSkillCandidate(
          skillsToFilter: string[], newSkillCandidate: string): OperatorFunction<string[], MatchingSkillsAndNewSkill> {
          return map<string[], MatchingSkillsAndNewSkill>(matchingSkills => {
            const filteredSkills = matchingSkills.filter(skill => skillsToFilter.indexOf(skill) === -1);
            const skillCanBeAdded = listContainsNoElementIgnoringCase(matchingSkills, newSkillCandidate)
              && listContainsNoElementIgnoringCase(skillsToFilter, newSkillCandidate);
            return {
              matchingSkills: filteredSkills,
              newSkill: (skillCanBeAdded ? newSkillCandidate : undefined)
            };

            function listContainsNoElementIgnoringCase(list: string[], element: string): boolean {
              const elementLowerCase = element.toLowerCase();
              return list.filter((el) => el.toLowerCase() === elementLowerCase).length === 0;
            }
          });
        }
      })
    );
  }

  addSelectedSkills(): Promise<boolean> {
    this.editedProfileStore.updateProfileOnSkills(this.getSelectedSkills());
    return this.router.navigate(['../'], {
      relativeTo: this.route,
    });
  }

  updateQueryUrlParamOnNewValue(newQuery: string): Promise<boolean> {
    const params = {...this.route.snapshot.params};
    params[queryParam] = newQuery;
    return this.router.navigate([params], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  goToPreviousDialog(): void {
    this.location.back();
  }

  updateSelectedSkillsUrlParam(skillToBeAddedToSelectedOnes: string): Promise<boolean> {
    return this.updateUrlParamOnNewSkills([...this.getSelectedSkills(), skillToBeAddedToSelectedOnes]);
  }

  createNewSkillAndUpdateSelectedSkillsUrlParam(skillToBeCreatedAndAddedToSelectedOnes: string): void {
    this.skills.create({name: skillToBeCreatedAndAddedToSelectedOnes})
      .subscribe((savedSkill) => {
        return this.updateUrlParamOnNewSkills([...this.getSelectedSkills(), savedSkill.name]);
      });
  }

  removeSkillAndUpdateSelectedSkillsUrlParam(skillToBeRemoved: string): Promise<boolean> {
    const currentSkills = this.getSelectedSkills();
    return this.updateUrlParamOnNewSkills(
      currentSkills.filter(skill => skill !== skillToBeRemoved)
    );
  }

  private updateUrlParamOnNewSkills(newSkills: string[]): Promise<boolean> {
    const params = {...this.route.snapshot.params};
    params[selectedSkillsParam] = newSkills.join(',');
    return this.router.navigate([params], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  private getSelectedSkills(): string[] {
    const {selectedSkills: commaSeparatedSelectedSkills} = this.route.snapshot.params;
    return splitSkills(commaSeparatedSelectedSkills);
  }
}
