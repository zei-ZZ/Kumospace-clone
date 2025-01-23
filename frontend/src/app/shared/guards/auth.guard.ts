import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const authenticatedUser = auth.isAuthenticated();
  const requestedUserId = route.params['userid'];

  if (!authenticatedUser || authenticatedUser.id !== requestedUserId) {
    router.navigateByUrl('/auth');
    return false;
  }

  return true;
};
