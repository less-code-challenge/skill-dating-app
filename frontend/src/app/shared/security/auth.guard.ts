import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SecurityService} from './security.service';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly security: SecurityService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    return this.security.userIsAuthenticated$.pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          setTimeout(() => this.security.navigateToSignIn(url));
        }
        return isAuthenticated;
      })
    );
  }
}
