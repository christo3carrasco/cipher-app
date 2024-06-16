import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-not-found',
  templateUrl: './user-not-found.component.html',
  styleUrl: './user-not-found.component.css',
})
export class UserNotFoundComponent {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/']);
  }
}
