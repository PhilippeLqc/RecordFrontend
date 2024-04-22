import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NotificationComponent } from '../../notification/notification.component';
import { NotificationService } from '../../../Service/notification.service';
import { ProjectService } from '../../../Service/project.service';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { ProjectInvitationDto } from '../../../model/projectInvitationDto';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

interface projectNotification {
  id: number,
  projectId: number,
  title : string
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NotificationComponent, LucideAngularModule, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit, OnDestroy {

  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  showUserMenu = false;
  showNotification = false;
  showInvite = false;
  notificationList: ProjectInvitationDto[] = [];
  projectNotifications: projectNotification[] = [];

  constructor(private elementRef: ElementRef, private notification: NotificationService, private project: ProjectService) { }

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

    console.log('PROJECTNOTIFICATION', this.projectNotifications);
  }

  ngOnDestroy(): void {
    this.notification.closeConnection();
  }

  getProjectName() {
    //for each projectId in notificationList, get the project name
    this.notificationList.forEach((notification) => {
      this.project.getProjectNameByInvitationId(notification.id).subscribe((project) => {
        const projectNotification: projectNotification = {
          ...notification,
          title: project.title
        };
      // Check if projectNotification with the same id already exists in projectNotifications
      if (!this.projectNotifications.some((check) => check.id === projectNotification.id)) {
        this.projectNotifications.push(projectNotification);
      }
      });
    });
  }

  acceptInvitation(projectId: number, invitationId: number) {
    console.log('Accepting invitation', projectId, invitationId);
    this.projectNotifications = this.projectNotifications.filter((notification) => notification.id !== invitationId);
    return this.project.acceptProjectInvitation(projectId, invitationId)
  }

  rejectInvitation(invitationId: number) {
    console.log('Rejecting invitation', invitationId);
    this.projectNotifications = this.projectNotifications.filter((notification) => notification.id !== invitationId);
    return this.project.rejectProjectInvitation(invitationId)
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showUserMenu = false;
      this.showNotification = false;
      this.showInvite = false;
    }
  }

  logout(){
    localStorage.clear();
    window.location.href = '/home';
  }

}
