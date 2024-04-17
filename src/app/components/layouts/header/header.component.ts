import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationComponent } from '../../notification/notification.component';
import { NotificationService } from '../../../Service/notification.service';
import { ProjectService } from '../../../Service/project.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NotificationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  userId = JSON.parse(localStorage.getItem('currentUser')!).id;

  constructor(private notification: NotificationService, private project: ProjectService) { }

  ngOnInit(): void {
    this.notification.joinNotificationRoom(`${this.userId}`);
  }

  ngOnDestroy(): void {
    this.notification.closeConnection();
  }

}
