import {Component} from '@angular/core';
import {SecurityService} from './shared/security/security.service';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'sd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  overlayShown = this.security.username$.pipe(map((email) => !email));

  constructor(
    private readonly security: SecurityService,
    private readonly router: Router
  ) {
  }

  configureLater(): void {
    this.overlayShown = of(false);
  }

  goToConfigureProfile(): void {
    this.router.navigate(['profile']);
  }
}
