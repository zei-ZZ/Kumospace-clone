import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('access_token');
  
  if (!token) {
    router.navigateByUrl('/auth');
    return false;
  }

  return auth.validateToken(token).pipe(
    take(1),
    map(isValid => {
      if (!isValid) {
        router.navigateByUrl('/auth');
        return false;
      }
      
      const authenticatedUser = auth.isAuthenticated();
      const requestedUserId = route.params['userid'];
      
      if (!authenticatedUser || authenticatedUser.id !== requestedUserId) {
        router.navigateByUrl('/auth');
        return false;
      }
      
      return true;
    })
  );
};
