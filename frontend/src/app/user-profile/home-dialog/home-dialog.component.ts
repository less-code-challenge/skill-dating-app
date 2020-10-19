import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SkillTo } from 'src/app/model/skill.to';
import { RecentSearchTo } from 'src/app/model/recent-search.to';

@Component({
  selector: 'sd-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.scss'],
})
export class HomeDialogComponent {
  skills: SkillTo[];
  searches: RecentSearchTo[];
  constructor(activatedRoute : ActivatedRoute ) {
    this.skills = activatedRoute.snapshot.data.skills;
    this.searches = activatedRoute.snapshot.data.searches;
  }
}
