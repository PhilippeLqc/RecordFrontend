import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../Service/notification.service';
import { UserService } from '../../Service/user.service';
import { ProjectService } from '../../Service/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProjectInvitationDto } from '../../model/projectInvitationDto';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{
  
  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  currentProjectId!: number;
  email = ''
  notification: ProjectInvitationDto[] = [];
  notificationList: ProjectInvitationDto[] = []

  constructor(
    private notificationService: NotificationService, 
    private user: UserService,
    private project: ProjectService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
      this.notificationService.getNotificationHistory(`${this.userId}`).subscribe((notifications) => {
        this.notification = notifications;
      });
      this.project.currentProject$.subscribe((project) => {this.currentProjectId = project.id});
      this.listenerNotifications();
  }

  sendNotification(email: string) {
    const inviteUser$ = this.project.inviteUserToProject(email, this.currentProjectId);
    const getUser$ = this.user.getUserByEmail(email);
    const projectInvitation: ProjectInvitationDto = {
      id: 0,
      projectId: this.currentProjectId,
      userId: this.userId,
    };
    forkJoin([inviteUser$, getUser$]).subscribe({
      next: ([inviteResponse, user]) => {
        console.log('Invitation sent successfully', inviteResponse);
        this.notificationService.sendNotification(user.id, projectInvitation);
        this.snackBar.open('Invitation sent successfully', 'Close', { duration: 4000, });
      },
      error: error => {
        console.error('Error', error);
        this.snackBar.open('Error sending invitation', 'Close', { duration: 4000, });
      }
    });
  }

  listenerNotifications() {
    this.notificationService.getNotifications().subscribe((notifications: any) =>
    this.notificationList = [...this.notificationList, ...notifications]);
  }
}
