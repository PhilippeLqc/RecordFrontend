import { Routes } from '@angular/router';
import { AuthentificationComponent } from './components/authentification/authentification.component';
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/homepage/home.component';
import { ProjectComponent } from './components/project/project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

export const routes: Routes = [
    {path: 'authentification', component: AuthentificationComponent},
    {path: 'home', component: HomeComponent},
    {path: 'chat/:userIdchat', component: ChatComponent},
    {path: 'chat/:roomId', component: ChatComponent},
    {path: 'project', component: ProjectComponent},
    {path: 'project/:projectId', component: ProjectDetailsComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];
