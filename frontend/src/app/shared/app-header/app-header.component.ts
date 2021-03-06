import {Component} from '@angular/core';
import {SecurityService} from '../security/security.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
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
      .pipe(
        catchError(() => of(null)),
        map(user => user?.initials)
      );
  }

  goToProfile(): void {
    this.router.navigate(['my-profile']);
  }

  logOut(): Promise<void> {
    return this.security.signOut();
  }
}
