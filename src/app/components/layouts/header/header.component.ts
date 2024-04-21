import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationComponent } from '../../notification/notification.component';
import { NotificationService } from '../../../Service/notification.service';
import { ProjectService } from '../../../Service/project.service';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { ProjectInvitationDto } from '../../../model/projectInvitationDto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NotificationComponent, LucideAngularModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  showUserMenu = false;
  showNotification = false;
  showInvite = false;
  notificationList: ProjectInvitationDto[] = [];
  projectNames: string[] = [];

  constructor(private notification: NotificationService, private project: ProjectService) { }

  ngOnInit(): void {
    this.notification.joinNotificationRoom(`${this.userId}`);
    this.notification.getNotificationHistory(this.userId).subscribe((notifications) => {
      this.notificationList = notifications;
      this.getProjectName();
    });
    this.notification.notifications$.subscribe((notification) => {
      console.log('Notification received', notification);
      this.notificationList = notification;
      this.getProjectName();
    });
  }

  ngOnDestroy(): void {
    this.notification.closeConnection();
  }

  getProjectName() {
    //for each projectId in notificationList, get the project name
    this.notificationList.forEach((notification) => {
      this.project.getProjectById(notification.projectId).subscribe((project) => {
        if (!this.projectNames.includes(project.title)) {
          this.projectNames = [...this.projectNames, project.title];
        }
      });
    });
  }

  // acceptInvitation(projectId: number) {
  //   this.project.acceptProjectInvitation(projectId).subscribe((response) => {
  //     console.log('Project invitation accepted', response);
  //   });
  // }

  // rejectInvitation(projectId: number) {
  //   this.project.rejectProjectInvitation(projectId).subscribe((response) => {
  //     console.log('Project invitation rejected', response);
  //   });
  // }

  logout(){
    localStorage.clear();
    window.location.href = '/home';
  }

}
