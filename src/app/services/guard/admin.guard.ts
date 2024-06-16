import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    const userData = JSON.parse(user);
    if (userData.role === 'ADMIN_ROLE') {
      return true;
    }
  }

  router.navigate(['sign-in']);
  return false;
};
