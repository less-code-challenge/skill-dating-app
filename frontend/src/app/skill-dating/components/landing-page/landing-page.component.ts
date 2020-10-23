import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SecurityService } from '../../../shared/security/security.service';

@Component({
  selector: 'ui-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  constructor(private readonly security: SecurityService) {}

  goToLogIn(): void {
    this.security.navigateToSignIn();
  }
  goToCreateAccount(): void {
    this.goToLogIn();
  }
}
