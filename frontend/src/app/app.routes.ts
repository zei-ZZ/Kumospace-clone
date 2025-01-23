import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './user-page/user-page.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'userpage/:userid', 
    component: UserPageComponent, 
    canActivate: [authGuard]
  }
];
