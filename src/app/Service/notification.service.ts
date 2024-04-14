import { Injectable } from '@angular/core';
import { IMessage, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';
import { ProjectInvitationDto } from '../model/projectInvitationDto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject: BehaviorSubject<ProjectInvitationDto[]> = new BehaviorSubject<ProjectInvitationDto[]>([]);
  public notification$ = this.notificationSubject.asObservable();

  private stompClient: any;
  public userId: string | null = null;
    
constructor() { }

initNotificationConnection(): void {
  const url = 'http://localhost:9000/api/notification-socket';
    this.stompClient = Stomp.over(() => new SockJS(url));
    this.stompClient.connect({}, this.onConnected.bind(this), this.onError.bind(this));
  }

  onConnected(): void {
    console.log('Connected to Notification Service');
    this.stompClient.subscribe('/user/queue/notifications', (payload: any) => {
      console.log('Received a notification');
      console.log('Subscribed to: /user/queue/notifications');
      this.onNotificationReceived(payload);
    });
    console.log('Notification Subject on Connected function: ', this.notificationSubject);
    this.stompClient.publish({destination: '/app/notification', body: JSON.stringify({sender: this.userId, type: 'JOIN'})});
  }

onNotificationReceived(payload: IMessage): void {
  console.log('received notification: ', payload);
  const notification = JSON.parse(payload.body);
  this.notificationSubject.next(notification);

  const currentNotification = this.notificationSubject.getValue();
  currentNotification.push(notification);
  this.notificationSubject.next(currentNotification);

  console.log('Notification Received: ', notification);
  console.log('Notification Subject on notification received: ', this.notificationSubject);
}

sendNotification(notification: any): void {
  console.log('Sending notification: ', notification);
  this.stompClient.publish({destination: '/app/notification', body: JSON.stringify(notification)});
}

onError(error: any) {
  console.log('Error: ', error);
}

disconnect(): void {
  if (this.stompClient !== null) {
    this.stompClient.disconnect();
  }
}

}