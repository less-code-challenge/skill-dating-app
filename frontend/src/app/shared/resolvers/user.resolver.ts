import {Resolve} from '@angular/router';
import {User} from '../security/user';
import {SecurityService} from '../security/security.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class UserResolver implements Resolve<User | undefined> {
  constructor(private readonly security: SecurityService) {
  }

  resolve(): Observable<User | undefined>{
    return this.security.user$;
  }
}
