import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { MessageDto } from '../model/messageDto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private subscription: {[roomId: string]: any} = {};
  messages: MessageDto[] = [];
  // BehaviorSubject to emit the messages to the components
  private messagesSubject: BehaviorSubject<MessageDto[]> = new BehaviorSubject<MessageDto[]>([]);


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
  joinRoom(roomId: string) {
    if (this.subscription[roomId]) {
      return;
    }

    this.stompClient.connect({}, () => {
      // TODO change RoomId by ProjectId for clarification
      this.stompClient.subscribe(`/topic/${roomId}`, (message: any) => {

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
  sendMessage(roomId: number, ChatMessage: MessageDto) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(ChatMessage));
  }
  // --------------------------------------------

  
  // Get the history of messages for a room identified by the project ID
  getHistory(roomId: string) {
    return this.http.get<MessageDto[]>(this.serviceURL + '/getHistory/' + roomId);
  }
  // --------------------------------------------
  
  // Get the messages from the subject
  getMessages() {
    return this.messagesSubject.asObservable();
  }
  // --------------------------------------------

  // Close the connection
  closeConnection(roomId: string) {
    if (this.subscription[roomId]) {
      this.subscription[roomId].unsubscribe();
      delete this.subscription[roomId];
    }
  }

}
