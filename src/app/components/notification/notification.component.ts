import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../Service/notification.service';
import { AuthService } from '../../Service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy{

  constructor(private notificationService: NotificationService, private authService : AuthService) { }
  
  public notificationSubscription?: Subscription;
  notification: any[] = [];

  ngOnInit(): void {
    this.notificationService.userId = String(this.authService.currentUser?.id);
    this.notificationService.initNotificationConnection();
    this.notificationSubscription = this.notificationService.notification$.subscribe(notification => {
      console.log(notification);
      this.notification.push(notification);
    });
  }

  ngOnDestroy(): void {
    this.notificationService.disconnect();
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

}
