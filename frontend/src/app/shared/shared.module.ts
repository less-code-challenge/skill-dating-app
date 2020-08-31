import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SecurityService} from './security/security.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthHttpInterceptor} from './security/auth.http-interceptor';
import {AuthGuard} from './security/auth.guard';
import {AfterSignInCallbackComponent} from './security/after-sign-in-callback.component';

@NgModule({
  declarations: [AfterSignInCallbackComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        SecurityService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthHttpInterceptor,
          multi: true,
        },
        AuthGuard]
    };
  }
}
