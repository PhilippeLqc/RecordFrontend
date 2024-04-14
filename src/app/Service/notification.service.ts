import { Injectable } from '@angular/core';
import { IMessage, Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<any>(null);
  public notification$ = this.notificationSubject.asObservable();

  private stompClient: any;
  public userId: string | null = null;
    
constructor() { }

initNotificationConnection(): void {
  console.log('Connected to Notification Service');
  const url = 'http://localhost:9000/api/notification-socket';
    this.stompClient = Stomp.over(() => new SockJS(url));
    this.stompClient.connect({}, this.onConnected.bind(this), this.onError.bind(this));
  }

onConnected():void {
  this.stompClient.subscribe('/user/queue/notifications', this.onNotificationReceived.bind(this));
  this.stompClient.subscribe('/user/queue/notifications', (message: any) => this.onNotificationReceived(message));
  console.log('appel de this.stomp.publish service');
  this.stompClient.publish({destination: '/app/notification', body: JSON.stringify({sender: this.userId, type: 'JOIN'})});
}

onNotificationReceived(payload: IMessage): void {
  const notification = JSON.parse(payload.body);
  this.notificationSubject.next(notification);
  console.log('Notification Received: ', notification);
  console.log('Notification Subject: ', this.notificationSubject);
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