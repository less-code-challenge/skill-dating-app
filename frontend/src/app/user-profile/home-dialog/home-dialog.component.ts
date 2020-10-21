import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SkillTo} from 'src/app/model/skill.to';
import {RecentSearchTo} from 'src/app/model/recent-search.to';
import {SkillService} from '../skill.service';

@Component({
  selector: 'sd-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.scss'],
})
export class HomeDialogComponent {
  skills: SkillTo[];
  searches: RecentSearchTo[];

  constructor(activatedRoute: ActivatedRoute, skills: SkillService) {
    this.skills = activatedRoute.snapshot.data.skills;
    this.searches = activatedRoute.snapshot.data.searches;
    skills.findAll().subscribe(allSkills => console.log(allSkills));
  }
}
