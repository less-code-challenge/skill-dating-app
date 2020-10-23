import {Component} from '@angular/core';
import {SecurityService} from '../security/security.service';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'sd-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  token$: Observable<string> = this.security.username$;
  userInitial$ = this.token$.pipe(
    filter((email) => !!email),
    map((email: string) => {
      const [[firstInitial], [secondInitial]] = email.toUpperCase().split('.');
      return firstInitial + secondInitial;
    })
  );

  constructor(private readonly security: SecurityService) {
  }

  logOut(): void {
    this.security.signOut();
  }

  goToProfile(): void {
    // this.router.navigate(['profile']);
  }
}
