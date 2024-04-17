import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageDto } from '../model/messageDto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private subscription: {[projectId: string]: any} = {};
  private messagesSubject: BehaviorSubject<MessageDto[]> = new BehaviorSubject<MessageDto[]>([]);
  messages: MessageDto[] = [];


  constructor(private http: HttpClient) { 
}
  
  serviceURL = 'http://localhost:8081/api/websocket';
  

  // Initialize the connection to the websocket
  initConnection() {
    const url = 'http://localhost:9000/api/chat-socket';
    this.stompClient = Stomp.over(() => new SockJS(url));
    return this.stompClient;
  }
  // --------------------------------------------

  // Join a room. The room is identified by The project ID
  joinRoom(projectId: string) {
    if (this.subscription[projectId]) {
      return;
    }

    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/topic/${projectId}`, (message: any) => {

        // Parse the message and add it to the messages array
        const messageContent = JSON.parse(message.body);
        messageContent.sender = messageContent.userId;
        delete messageContent.userId;

        // Add the message to the subject to emit it
        const currentMessages = this.messagesSubject.getValue();
        currentMessages.push(messageContent);
        this.messagesSubject.next(currentMessages);
      });
    });
  }
  // --------------------------------------------
  
  // Send a message to the room identified by the project ID
  sendMessage(projectId: number, ChatMessage: MessageDto) { 
    this.stompClient.send(`/app/chat/${projectId}`, {}, JSON.stringify(ChatMessage));
  }
  // --------------------------------------------

  
  // Get the history of messages for a room identified by currentprojectId
  getHistory(projectId: string) {
    return this.http.get<MessageDto[]>(this.serviceURL + '/getHistory/' + projectId);
  }
  // --------------------------------------------
  
  // Get the messages from the subject
  getMessages() {
    return this.messagesSubject.asObservable();
  }
  // --------------------------------------------

  // Close the connection
  closeConnection(projectId: number) {
    if (this.subscription[projectId]) {
      this.subscription[projectId].unsubscribe();
      delete this.subscription[projectId];
    }
  }

}
