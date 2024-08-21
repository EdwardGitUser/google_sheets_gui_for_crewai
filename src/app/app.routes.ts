import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { MainPageComponent } from './main-page/main-page.component';
import { AgentsComponent } from './main-page/agents/agents.component';
import { CreateCrewComponent } from './main-page/crew/create-crew/create-crew.component';
import { CreateAgentComponent } from './main-page/agents/create-agent/create-agent.component';
import { TasksComponent } from './main-page/tasks/tasks.component';
import { AddTaskComponent } from './main-page/tasks/add-task/add-task.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'crew/:id/agents',
        component: AgentsComponent,
      },
      {
        path: 'crew/:id/agents/add', // New route for adding an agent
        component: CreateAgentComponent,
      },
      {
        path: 'crew/:id/tasks',
        component: TasksComponent,
      },
      {
        path: 'crew/:id/tasks/add',
        component: AddTaskComponent,
      },
    ],
  },
  {
    path: 'create-crew',
    component: CreateCrewComponent,
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
