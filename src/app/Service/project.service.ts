import {  HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDto } from '../model/projectDto';
import { Status } from '../enumTypes/status';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private auth: AuthService) { 
    this.currentProjectDto = {
      id: 0,
      title: '',
      description: '',
      status: 'ACTIVE' as Status,
      boardlistIds: [],
      userIds: []
    }
  }

  projectServiceUrl = 'http://localhost:8081/api/project';
  currentProjectDto: ProjectDto;
  currentProject?: ProjectDto;
  userProjects: ProjectDto[] = [];

  //create a project
  createProject(project: ProjectDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(this.projectServiceUrl + '/create', project).pipe(
      tap((response) => {
        this.currentProject = response;
      })
    );
  }

  //get all projects by user id
  getProjectsByUserId(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.projectServiceUrl + '/allProjects').pipe(
      tap((response) => {
        console.log(response);
        this.userProjects = response;
      })
    );
  }

  //get project by status
  getProjectsByStatus(status: Status): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.projectServiceUrl + '/status/' + status);
  }

  //get project by status and user id
  getProjectsByStatusAndUserId(status: Status): Observable<ProjectDto[]> {
    const userId = this.auth.currentUser.id;
    return this.http.get<ProjectDto[]>(this.projectServiceUrl + '/status/' + status + '/user/' + userId);
  }

  //update current project
  updateCurrentProject(project: Project): Observable<Project> {
    const ProjectId = this.currentProjectDto.id
    return this.http.put<Project>(this.projectServiceUrl + '/update/' + ProjectId, project).pipe(
      tap((response) => {
        this.currentProject = response;
      })
    );
  }

  // invite user to project by ProjectId and searching by mail
  inviteUserToProject(email: string, projectId: number): Observable<Project> {
    return this.http.post<Project>(this.projectServiceUrl + '/invite/'+ projectId, email).pipe(
      tap((response) => {
        this.currentProject = response;
  })
  );
  }
}
