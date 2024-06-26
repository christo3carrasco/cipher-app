import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularMaterialModule } from './components/shared/angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { authHeaderInterceptor } from './services/interceptor/auth-header.interceptor';
import { UserSignInComponent } from './components/user-module/user-sign-in/user-sign-in.component';
import { UserSignUpComponent } from './components/user-module/user-sign-up/user-sign-up.component';
import { UserNotFoundComponent } from './components/user-module/user-not-found/user-not-found.component';
import { VoterComponent } from './components/voter-module/voter/voter.component';
import { VotingComponent } from './components/voting-module/voting/voting.component';
import { AdminComponent } from './components/admin-module/admin/admin.component';
import { UserComponent } from './components/admin-module/user/user.component';
import { VotingFormComponent } from './components/voting-module/voting-form/voting-form.component';
import { VotingDetailsComponent } from './components/voting-module/voting-details/voting-details.component';
import { OptionListComponent } from './components/option-module/option-list/option-list.component';
import { ParticipantListComponent } from './components/participant-module/participant-list/participant-list.component';
import { ResultsModalComponent } from './components/result-module/results-modal/results-modal.component';
import { VoteComponent } from './components/vote-module/vote/vote.component';
import { ProfileComponent } from './components/user-module/profile/profile.component';
import { TransparencyModalComponent } from './components/transparency-module/transparency-modal/transparency-modal.component';
import { TransparencyComponent } from './components/transparency-module/transparency/transparency.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    UserSignInComponent,
    UserSignUpComponent,
    UserNotFoundComponent,
    VoterComponent,
    VotingComponent,
    AdminComponent,
    UserComponent,
    VotingFormComponent,
    VotingDetailsComponent,
    OptionListComponent,
    ParticipantListComponent,
    ResultsModalComponent,
    VoteComponent,
    ProfileComponent,
    TransparencyModalComponent,
    TransparencyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatNativeDateModule,
    FormsModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authHeaderInterceptor])),
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
