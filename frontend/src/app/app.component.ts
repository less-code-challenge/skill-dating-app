import {Component} from '@angular/core';
import {SecurityService} from './shared/security/security.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'sd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  token$: Observable<string>;

  constructor(private readonly security: SecurityService) {
    this.token$ = security.username$;
  }

  goToUi(): void {
    this.security.navigateToSignIn();
  }

  logOut(): void {
    this.security.signOut();
  }
}
