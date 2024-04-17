import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDto } from '../model/projectDto';
import { Status } from '../enumTypes/status';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Project } from '../model/project';
import { ProjectInvitationDto } from '../model/projectInvitationDto';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient, private auth: AuthService) {
    const storedProjects = localStorage.getItem('userProjects');
    if (storedProjects) {
      this.userProjects = JSON.parse(storedProjects);
      this.userProjectsSubject.next(this.userProjects);
    }
  }

  projectServiceUrl = 'http://localhost:8081/api/project';

  private userProjectsSubject = new BehaviorSubject<ProjectDto[]>([]);
  private currentProjectSubject = new BehaviorSubject<ProjectDto>({} as ProjectDto);
  currentProject$ = this.currentProjectSubject.asObservable();
  currentProject!: ProjectDto;
  userProjects$ = this.userProjectsSubject.asObservable();
  userProjects: ProjectDto[] = [];

  //create a project
  createProject(project: ProjectDto): Observable<ProjectDto> {
    return this.http
      .post<ProjectDto>(this.projectServiceUrl + '/create', project)
      .pipe(
        tap((response) => {
          this.currentProject = response;
          this.userProjectsSubject.next(this.userProjects);
        })
      );
  }

  //get all projects by user id
  getProjectsByUserId(): Observable<ProjectDto[]> {
    return this.http
      .get<ProjectDto[]>(this.projectServiceUrl + '/allProjects')
      .pipe(
        tap((response) => {
          this.userProjects = response;
          this.userProjectsSubject.next(this.userProjects);
        })
      );
  }

  //get project by status
  getProjectsByStatus(status: Status): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(
      this.projectServiceUrl + '/status/' + status
    );
  }

  //get project by status and user id
  getProjectsByStatusAndUserId(status: Status): Observable<ProjectDto[]> {
    const userId = this.auth.currentUser.id;
    return this.http.get<ProjectDto[]>(
      this.projectServiceUrl + '/status/' + status + '/user/' + userId
    );
  }

  //get project by id
  getProjectById(projectId: number): Observable<ProjectDto> {
    return this.http
      .get<ProjectDto>(this.projectServiceUrl + '/' + projectId)
      .pipe(
        tap((response) => {
          this.currentProject = response;
        })
      );
  }

  //update current project
  updateCurrentProject(project: Project): Observable<Project> {
    const ProjectId = this.currentProject.id;
    return this.http
      .put<Project>(this.projectServiceUrl + '/update/' + ProjectId, project)
      .pipe(
        tap((response) => {
          this.currentProject = response;
        })
      );
  }

  // invite user to project by ProjectId and searching by mail
  inviteUserToProject(email: string, projectId: number): Observable<ProjectInvitationDto> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<ProjectInvitationDto>(this.projectServiceUrl + '/invite/' + projectId, { email: email }, { headers });
  }

  changeCurrentProject(project: ProjectDto) {
    console.log('changeCurrentProject', project);
    this.currentProject = project;
    this.currentProjectSubject.next(project);
  }

}
