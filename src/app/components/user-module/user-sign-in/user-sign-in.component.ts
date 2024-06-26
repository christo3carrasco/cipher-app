import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SignInService } from '../../../services/user/sign-in.service';
import { SignInData } from '../../../models/user/sign-in-data';

@Component({
  selector: 'app-user-sign-in',
  templateUrl: './user-sign-in.component.html',
  styleUrl: './user-sign-in.component.css',
})
export class UserSignInComponent implements OnInit {
  signInForm!: FormGroup;
  authError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signInService: SignInService
  ) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const signInData: SignInData = this.signInForm.value;

      this.signInService.signIn(signInData).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/voter']);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.authError = true;
        },
      });
    }
  }
}
