import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { catchError, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationProjectService implements OnInit {

  invitationProjectServiceUrl = 'http://localhost:8081/api/project';
  currentProjectId = ''; 
  stompClient: any;
  userId: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.currentProjectId = this.route.snapshot.params["projectId"];
    console.log('Current project id: ', this.currentProjectId);
  }

  inviteUserToProject(projectId: number, email: string) {

    return this.http.post(this.invitationProjectServiceUrl + '/invite/' + projectId, {email: email}).pipe(
      tap(() => {
        console.log('appel de this.stomp.publish');
        this.stompClient.publish({ destination: '/app/notification', body: JSON.stringify({ sender: 'test', type: 'JOIN' })});
      })
    );
  }


      invite(projectId: number, email: string) {
        return this.userService.getUserByEmail(email).pipe(
      catchError((error) => {
        console.log('Error during getting user by email', error);
        return of(null);
      }),
      switchMap((user) => {
        if (user) {
          return this.inviteUserToProject(projectId, email);
        } else {
          return of(null);
        }
      }
    )
  )};

  getInvitations() {
    return this.http.get(this.invitationProjectServiceUrl + '/invitations');
  }

  acceptInvitation(projectId: string) {
    return this.http.post(this.invitationProjectServiceUrl + '/accept-invitation/' + projectId, null);
  }

  declineInvitation(projectId: string) {
    return this.http.post(this.invitationProjectServiceUrl + '/decline-invitation/' + projectId, null);
  }
}
