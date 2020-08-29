import Auth, {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Hub} from '@aws-amplify/core';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

interface SecurityContext {
  username?: string;
  jwtAccessToken?: string;
}

@Injectable()
export class SecurityService {
  readonly username$: Observable<string>;
  readonly jwtAccessToken$: Observable<string>;

  constructor(public readonly router: Router) {
    Auth.configure(environment.authConfig);
    const userContext$ = createUserContextFromCurrentSession();
    this.username$ = userContext$.pipe(map(context => context.username || ''));
    this.jwtAccessToken$ = userContext$.pipe(map(context => context.jwtAccessToken || ''));
    this.navigateToBackUrlOnSignIn();
  }

  navigateToSignIn(backUrl?: string): Promise<void> {
    const backUrlKey = this.storeBackUrl(backUrl);

    return Auth.federatedSignIn(
      {
        provider: CognitoHostedUIIdentityProvider.Cognito,
        customState: backUrlKey
      }).then(() => undefined);
  }

  signOut(): Promise<void> {
    return Auth.signOut();
  }

  private navigateToBackUrlOnSignIn(): void {
    Hub.listen('auth', ({payload: {event, data}}) => {
      if (event === 'customOAuthState') {
        const url = getBackUrlBy(data);
        this.router.navigateByUrl(url);
      }
    });

    function getBackUrlBy(key: string): string {
      const url = localStorage.getItem(key) || '/';
      localStorage.removeItem(key);
      return url;
    }
  }

  private storeBackUrl(backUrl?: string): string {
    const key = `URL-${Date.now()}`;
    localStorage.setItem(key, backUrl || this.router.url);
    return key;
  }
}

function createUserContextFromCurrentSession(): Observable<SecurityContext> {
  return fromPromise(Auth.currentSession()
    .then(currentSession => ({
        jwtAccessToken: currentSession.getAccessToken().getJwtToken(),
        username: currentSession.getIdToken().payload.email
      }),
      () => ({})));
}

