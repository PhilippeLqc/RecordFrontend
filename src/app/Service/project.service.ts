import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectDto } from '../model/projectDto';
import { Status } from '../enumTypes/status';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Project } from '../model/project';
import { ProjectInvitationDto } from '../model/projectInvitationDto';
import { UserDto } from '../model/userDto';

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
        this.userProjects = [...this.userProjects, response];
        this.userProjectsSubject.next(this.userProjects);
        })
      );
  }

  //get all projects by user id
  getProjectsByUserId(userId: number): Observable<ProjectDto[]> {
    return this.http
      .get<ProjectDto[]>(this.projectServiceUrl + '/allProjects/' + userId)
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
  getProjectById(projectId: number, userId: number): Observable<ProjectDto> {
    return this.http
      .post<ProjectDto>(this.projectServiceUrl + '/' + projectId, userId)
      .pipe(
        tap((response) => {
          this.currentProject = response;
        })
      );
  }

  //update current project
  updateCurrentProject(project: ProjectDto): Observable<Project> {
    return this.http
      .put<Project>(this.projectServiceUrl + '/update/' + project.id, project)
      .pipe(
        tap((response) => {
          this.currentProject = response;
          console.log("end update");
        })
      );
  }


  //delete project by id
  // deleteProjectById(projectId: number): Observable<Project> {
  //   return this.http.delete<Project>(this.projectServiceUrl + '/delete/' + projectId);
  // }
  deleteProjectById(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.projectServiceUrl}/delete/${projectId}`).pipe(
      tap(() => {
        this.userProjects = this.userProjects.filter(project => project.id !== projectId);
        this.userProjectsSubject.next(this.userProjects);
      })
    );
  }

  // invite user to project by ProjectId and searching by mail
  inviteUserToProject(email: string, projectId: number): Observable<ProjectInvitationDto> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<ProjectInvitationDto>(this.projectServiceUrl + '/invite/' + projectId, { email: email }, { headers });
  }

  acceptProjectInvitation(projectId: number, invitationId: number) {
    console.log('acceptProjectInvitation', projectId, invitationId);
    return this.http.put<ProjectInvitationDto>(this.projectServiceUrl + '/accept-invitation/' + projectId, invitationId).subscribe(() => {
      console.log('Project invitation accepted');
    });
  }

  rejectProjectInvitation(invitationId: number) {
    console.log('rejectProjectInvitation', invitationId);
    return this.http.delete<ProjectInvitationDto>(this.projectServiceUrl + '/decline-invitation/' + invitationId).subscribe(() => {
      console.log('Project invitation rejected');
    });
  }

  changeCurrentProject(project: ProjectDto) {
    console.log('changeCurrentProject', project);
    this.currentProject = project;
    this.currentProjectSubject.next(project);
  }

  //get users by project id
  getUsersByProjectId(projectId: number): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.projectServiceUrl + '/users/project/' + projectId, {});
  }

  getProjectNameByInvitationId(invitationId: number): Observable<{title: string}> {
    // if response 404 OK, return null, else return response
    if (invitationId === 0) {
      return of({ title: '' });
    }

    return this.http.get<{title: string}>(this.projectServiceUrl + '/projectName/' + invitationId);
  }

}
