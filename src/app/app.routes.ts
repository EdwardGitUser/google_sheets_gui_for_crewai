import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { MainPageComponent } from './main-page/main-page.component';
import { AgentsComponent } from './main-page/agents/agents.component';
import { CreateCrewComponent } from './main-page/crew/create-crew/create-crew.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'crew/:id/agents',
        component: AgentsComponent,
      },
    ],
  },
  {
    path: 'create-crew',
    component: CreateCrewComponent, // Add this route
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
