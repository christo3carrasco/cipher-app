import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSignInComponent } from './components/user-module/user-sign-in/user-sign-in.component';
import { UserSignUpComponent } from './components/user-module/user-sign-up/user-sign-up.component';
import { UserNotFoundComponent } from './components/user-module/user-not-found/user-not-found.component';
import { userGuard } from './services/guard/user.guard';
import { VoterComponent } from './components/voter-module/voter/voter.component';
import { VotingComponent } from './components/voting-module/voting/voting.component';
import { ProfileComponent } from './components/user-module/profile/profile.component';
import { adminGuard } from './services/guard/admin.guard';
import { AdminComponent } from './components/admin-module/admin/admin.component';
import { UserComponent } from './components/admin-module/user/user.component';
import { TransparencyComponent } from './components/transparency-module/transparency/transparency.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: UserSignInComponent },
  { path: 'sign-up', component: UserSignUpComponent },
  { path: 'voter', canActivate: [userGuard], component: VoterComponent },
  { path: 'voting', canActivate: [userGuard], component: VotingComponent },
  { path: 'profile', canActivate: [userGuard], component: ProfileComponent },
  { path: 'admin', canActivate: [adminGuard], component: AdminComponent },
  { path: 'user', canActivate: [adminGuard], component: UserComponent },
  { path: 'transparency', component: TransparencyComponent },
  { path: '**', component: UserNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
