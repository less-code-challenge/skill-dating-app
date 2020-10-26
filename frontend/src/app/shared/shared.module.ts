import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityService } from './security/security.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from './security/auth.http-interceptor';
import { AuthGuard } from './security/auth.guard';
import { RedirectToHomeGuard } from './security/redirect-to-home.guard';
import { AfterSignInCallbackComponent } from './security/after-sign-in-callback.component';
import { NavigationComponent } from './navigation/navigation.component';
import { OverlayComponent } from './overlay/overlay.component';

import { InputComponent } from './forms/input/input.component';
import { AvatarComponent } from './avatar/avatar.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { SearchInputComponent } from './search/search-input/search-input.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserContextService } from './user-context.service';

const exportedComponents = [
  OverlayComponent,
  NavigationComponent,
  InputComponent,
  AvatarComponent,
  AppHeaderComponent,
  SearchInputComponent,
];

const usedAndExportedModules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
];

@NgModule({
  declarations: [
    AfterSignInCallbackComponent,
    ...exportedComponents,
  ],
  imports: [...usedAndExportedModules],
  exports: [
    ...exportedComponents,
    ...usedAndExportedModules,
  ],
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
        UserContextService,
        AuthGuard,
        RedirectToHomeGuard,
      ],
    };
  }
}
