import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';
import { map } from 'rxjs/operators';

@Injectable()
export class RedirectToHomeGuard implements CanActivate {
  constructor(
    private readonly security: SecurityService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.security.username$.pipe(
      map((username) => !!username),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          setTimeout(() => this.router.navigate(['home']));
        }
        return !isAuthenticated;
      })
    );
  }
}
