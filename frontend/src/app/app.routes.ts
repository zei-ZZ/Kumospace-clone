import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './user-page/user-page.component';
import { authGuard } from './shared/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'userpage/:userid', 
    component: UserPageComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'layout',
    component: LayoutComponent
  },
];
