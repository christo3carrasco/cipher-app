import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularMaterialModule } from './components/shared/angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { authHeaderInterceptor } from './services/interceptor/auth-header.interceptor';
import { UserSignInComponent } from './components/user-module/user-sign-in/user-sign-in.component';
import { UserSignUpComponent } from './components/user-module/user-sign-up/user-sign-up.component';
import { UserNotFoundComponent } from './components/user-module/user-not-found/user-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    UserSignInComponent,
    UserSignUpComponent,
    UserNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authHeaderInterceptor])),
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
