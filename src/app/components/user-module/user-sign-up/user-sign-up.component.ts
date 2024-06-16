import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SignUpService } from '../../../services/user/sign-up.service';
import { SignUpData } from '../../../models/user/sign-up-data';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signUpService: SignUpService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      dateOfBirth: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const signUpData: SignUpData = this.signUpForm.value;

      this.signUpService.signUp(signUpData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        },
      });
    }
  }
}
