import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { isLoggedInGuard } from './auth/isLoggedIn.guard';
import { MainPageComponent } from './main-page/main-page.component';

import { CreateCrewComponent } from './main-page/crew/create-crew/create-crew.component';
import { CreateAgentComponent } from './main-page/agents/create-agent/create-agent.component';

import { AddTaskComponent } from './main-page/tasks/add-task/add-task.component';
import { KickoffComponent } from './kickoff/kickoff.component';
import { TableAgentsComponent } from './main-page/agents/table-agents/table-agents.component';
import { TaskTableComponent } from './main-page/tasks/task-table/task-table.component';
import { GoogleSheetComponent } from './main-page/google-sheet/google-sheet.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'crew/:id/google-sheet',
        component: GoogleSheetComponent,
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
            // children: [
            //   {
            //     path: 'add',
            //     component: CreateAgentComponent,
            //     canActivate: [isLoggedInGuard],
            //   },
            // ],
          },
          {
            path: 'tasks',
            component: TaskTableComponent,
            canActivate: [isLoggedInGuard],
            children: [
              {
                path: 'add',
                component: AddTaskComponent,
                canActivate: [isLoggedInGuard],
              },
            ],
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
