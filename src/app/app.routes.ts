import { Routes } from '@angular/router';
import { HomeComponent } from './components/homepage/home.component';
import { ProjectComponent } from './components/project/project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'project', component: ProjectComponent},
    {path: 'project/:projectId', component: ProjectDetailsComponent},
    {path: 'profile', component: ProfileComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];
