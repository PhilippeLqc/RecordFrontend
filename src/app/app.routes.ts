import { Routes } from '@angular/router';
import { HomeComponent } from './components/homepage/home.component';
import { ProjectComponent } from './components/project/project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Page403Component } from './pages/page-403/page-403.component';
import { Page404Component } from './pages/page-404/page-404.component';

import { AuthGuard } from './security/guard';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'project', component: ProjectComponent, canActivate: [AuthGuard]},
    {path: 'project/:projectId', component: ProjectDetailsComponent, canActivate: [AuthGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: '403', component: Page403Component},
    {path: '404', component: Page404Component},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', redirectTo: '/404'}

];
