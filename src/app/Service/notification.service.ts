import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectInvitationDto } from '../model/projectInvitationDto';
import { HttpClient } from '@angular/common/http';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  currentUserId = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).id as string : null;
  private StompClient: any;
  private subscription: {[userId: string]: any} = {};
  private notificationSubject: BehaviorSubject<ProjectInvitationDto[]> = new BehaviorSubject<ProjectInvitationDto[]>([]);
  notifications$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) { this.initNotificationConnection();}

  serviceURL = 'http://localhost:8081/api/websocket';

  // Initialize the connection to the websocket
  initNotificationConnection() {
    const url = 'http://localhost:9000/api/notification-socket';
    this.StompClient = Stomp.over(() => new SockJS(url));
    return this.StompClient;
  }

  // Join the user to the notification room
  joinNotificationRoom(userId: string) {
    if (this.subscription[userId]) {
      return;
    }

    this.StompClient.connect({}, () => {
      console.log('Connected to the websocket notification', this.currentUserId);
      this.StompClient.subscribe(`/topic/${this.currentUserId}/notification`, (message: any) => {

        const notificationContent = JSON.parse(message.body);
        const currentNotifications = this.notificationSubject.getValue();

        currentNotifications.push(notificationContent);
        this.notificationSubject.next(currentNotifications);

        // console.log('Notification received', notificationContent);
        // console.log('Notifications', currentNotifications);
      });
    });
  }

  sendNotification(userId: number, projectInvitation: ProjectInvitationDto) {
    this.StompClient.send(`/app/notification/${userId}`, {}, JSON.stringify(projectInvitation));
  }

  getNotifications() {
    return this.notifications$;
  }

  getNotificationHistory(userId: string) {
      // Supposons que vous ayez une méthode pour récupérer les notifications
      this.http.get<ProjectInvitationDto[]>(this.serviceURL + `/notificationhistory/${userId}`).subscribe(notifications => {
        // Ensuite, vous pouvez émettre les notifications
      this.notificationSubject.next(notifications);
      });
      return this.notifications$;
  }

  closeConnection() {
    this.StompClient.disconnect();
  }
}
