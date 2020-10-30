import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SecurityService} from './security/security.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthHttpInterceptor} from './security/auth.http-interceptor';
import {AuthGuard} from './security/auth.guard';
import {RedirectToHomeGuard} from './security/redirect-to-home.guard';
import {AfterSignInCallbackComponent} from './security/after-sign-in-callback.component';
import {NavigationComponent} from './navigation/navigation.component';
import {OverlayComponent} from './overlay/overlay.component';

import {InputComponent} from './forms/input/input.component';
import {AvatarComponent} from './avatar/avatar.component';
import {AppHeaderComponent} from './app-header/app-header.component';
import {SearchInputComponent} from './search/search-input/search-input.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ChipComponent} from './forms/chip/chip.component';
import {SelectComponent} from './forms/select/select.component';
import {NavigationService} from './navigation/navigation.service';
import {TextareaComponent} from './forms/textarea/textarea.component';
import {EditedProfileStoreService} from '../skill-dating/components/edit-profile-dialog/edited-profile-store.service';
import {UserResolver} from './resolvers/user.resolver';
import {BackButtonComponent} from './buttons/back-button/back-button.component';
import {CloseButtonComponent} from './buttons/close-button/close-button.component';
import {SafeUrlPipe} from './safe-url.pipe';
import {ValidationFeedbackComponent} from './forms/validation-error/validation-error.component';
import {AddButtonComponent} from './buttons/add-button/add-button.component';

const exportedComponents = [
  OverlayComponent,
  NavigationComponent,
  InputComponent,
  SelectComponent,
  AvatarComponent,
  AppHeaderComponent,
  SearchInputComponent,
  TextareaComponent,
  ChipComponent,
  BackButtonComponent,
  CloseButtonComponent,
  AddButtonComponent,
  SafeUrlPipe,
  ValidationFeedbackComponent
];

const usedAndExportedModules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
];

@NgModule({
  declarations: [AfterSignInCallbackComponent, ...exportedComponents],
  imports: [...usedAndExportedModules],
  exports: [...exportedComponents, ...usedAndExportedModules],
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
        EditedProfileStoreService,
        NavigationService,
        UserResolver,
        AuthGuard,
        RedirectToHomeGuard,
      ],
    };
  }
}
