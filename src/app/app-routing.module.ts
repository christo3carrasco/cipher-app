import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSignInComponent } from './components/user-module/user-sign-in/user-sign-in.component';
import { UserSignUpComponent } from './components/user-module/user-sign-up/user-sign-up.component';
import { UserNotFoundComponent } from './components/user-module/user-not-found/user-not-found.component';
import { userGuard } from './services/guard/user.guard';
import { VoterComponent } from './components/voter-module/voter/voter.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: UserSignInComponent },
  { path: 'sign-up', component: UserSignUpComponent },
  { path: 'voter', canActivate: [userGuard], component: VoterComponent },
  { path: '**', component: UserNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
