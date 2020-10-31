import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SecurityService} from './security.service';
import {catchError, flatMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private readonly security: SecurityService) {
  }

  // tslint:disable-next-line:no-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.security.jwtAccessToken$.pipe(
      flatMap(jwtAccessToken => {
        const request = jwtAccessToken ?
          req.clone({setHeaders: {Authorization: `Bearer ${jwtAccessToken}`}}) : req;
        return next.handle(request).pipe(
          catchError(error => {
            if (error instanceof HttpErrorResponse) {
              const httpErrorResponse = error as HttpErrorResponse;
              if (httpErrorResponse.status === 401) {
                console.log('Token expired. Reloading page');
                location.reload();
              }
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
