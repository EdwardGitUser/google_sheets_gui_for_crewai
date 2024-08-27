import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { isLoggedInGuard } from './shared/guards/isLoggedIn.guard';
import { MainPageComponent } from './main-page/main-page.component';

import { CreateCrewComponent } from './main-page/create-forms/create-crew/create-crew.component';

import { KickoffComponent } from './main-page/kickoff/kickoff.component';
import { TableAgentsComponent } from './main-page/tables/table-agents/table-agents.component';
import { TaskTableComponent } from './main-page/tables/task-table/task-table.component';
// import { GoogleSheetComponent } from './main-page/google-sheet/google-sheet.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'crew/:id/google-sheet',
        // component: GoogleSheetComponent,
        loadComponent: () =>
          import('./main-page/google-sheet/google-sheet.component').then(
            (mod) => mod.GoogleSheetComponent
          ),
        canActivate: [isLoggedInGuard],
        children: [
          {
            path: '',
            redirectTo: 'agents',
            pathMatch: 'full',
          },
          {
            path: 'agents',
            component: TableAgentsComponent,
            canActivate: [isLoggedInGuard],
          },
          {
            path: 'tasks',
            component: TaskTableComponent,
            canActivate: [isLoggedInGuard],
          },
          {
            path: 'kickoff',
            component: KickoffComponent,
            canActivate: [isLoggedInGuard],
          },
        ],
      },
      {
        path: 'create-crew',
        component: CreateCrewComponent,
        canActivate: [isLoggedInGuard],
      },
    ],
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
