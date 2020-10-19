import { Component } from '@angular/core';
import { SecurityService } from './shared/security/security.service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'sd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  overlayShown = this.security.username$.pipe(map((email) => !email));
  token$: Observable<string> = this.security.username$;
  userInitial$ = this.token$.pipe(
    filter((email) => !!email),
    map((email: string) => {
      const [[firstInitial], [secondInitial]] = email.toUpperCase().split('.');

      return firstInitial + secondInitial;
    })
  );
  constructor(
    private readonly security: SecurityService,
    private readonly router: Router
  ) {}

  goToUi(): void {
    this.security.navigateToSignIn();
  }

  logOut(): void {
    this.security.signOut();
  }
  configureLater(): void {
    this.overlayShown = of(false);
  }

  goToProfile(): void {
    this.router.navigate(['profile']);
  }
  goToConfigureProfile(): void {
    this.goToProfile();
  }
}
