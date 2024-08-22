import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { MainPageComponent } from './main-page/main-page.component';

import { CreateCrewComponent } from './main-page/crew/create-crew/create-crew.component';
import { CreateAgentComponent } from './main-page/agents/create-agent/create-agent.component';

import { AddTaskComponent } from './main-page/tasks/add-task/add-task.component';
import { KickoffComponent } from './kickoff/kickoff.component';
import { TableAgentsComponent } from './main-page/agents/table-agents/table-agents.component';
import { TaskTableComponent } from './main-page/tasks/task-table/task-table.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'crew/:id/agents',
        component: TableAgentsComponent,
      },
      {
        path: 'crew/:id/agents/add',
        component: CreateAgentComponent,
      },
      {
        path: 'crew/:id/tasks',
        component: TaskTableComponent,
      },
      {
        path: 'crew/:id/tasks/add',
        component: AddTaskComponent,
      },
      {
        path: 'create-crew',
        component: CreateCrewComponent,
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
    path: 'kickoff',
    component: KickoffComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
