import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { UserPageComponent } from './user-page/user-page.component';
import { authGuard } from './shared/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { SpaceComponent } from './space/space.component';

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
  {
    path: 'space',
    component: SpaceComponent
  }
];
