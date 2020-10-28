import {Component} from '@angular/core';
import {SecurityService} from '../security/security.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'sd-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  userInitial$: Observable<string | undefined>;

  constructor(
    private readonly security: SecurityService,
    private readonly router: Router
  ) {
    this.userInitial$ = security.user$
      .pipe(map(user => user?.initials));
  }

  goToProfile(): void {
    this.router.navigate(['my-profile']);
  }
}
