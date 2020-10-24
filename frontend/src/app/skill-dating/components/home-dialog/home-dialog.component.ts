import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SkillService} from '../../services/skill.service';
import {PopularSkillsTo} from '../../model/popular-skills.to';

@Component({
  selector: 'sd-home-dialog',
  templateUrl: './home-dialog.component.html',
  styleUrls: ['./home-dialog.component.scss'],
})
export class HomeDialogComponent {
  skills: PopularSkillsTo;
  movingTop = false;

  constructor(activatedRoute: ActivatedRoute,
              skills: SkillService,
              private readonly router: Router) {
    this.skills = activatedRoute.snapshot.data.skills;
    skills.findAll().subscribe(allSkills => console.log(allSkills));
  }

  goToTopSearch(): void {
    this.movingTop = true;
    setTimeout(() => {
      this.router.navigateByUrl('/search');
    }, 500);
  }
}
