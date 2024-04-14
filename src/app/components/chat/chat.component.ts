import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../Service/chat.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageDto } from '../../model/messageDto';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  userId = this.auth.currentUser?.id as number;
  messageList: any[] = [];
  historyMessages: any[] = [];
  userMessage: string = '';
  projectId = this.route.snapshot.paramMap.get('projectId')!;
  
  constructor(
    private chatService: ChatService,  
    private route: ActivatedRoute,
    private auth: AuthService,) {
    }
    
    ngOnInit(): void {
      this.userId = this.route.snapshot.params["userIdchat"];
      this.chatService.joinRoom(this.projectId);
      this.chatService.getHistory(this.projectId)
      this.listenerMessages();
      this.archiveMessages();
    }
    
    sendMessage() {
      const messageDto: MessageDto = {
        id: 0,
        message: this.userMessage,
        projectId: Number(this.projectId),
        userId: this.userId
    }
    this.chatService.sendMessage(messageDto.projectId, messageDto);
    this.userMessage = '';
  }
  
  listenerMessages() {
    this.chatService.getMessages().subscribe((messages: any) => {
      this.messageList = messages.map((message: any) => ({
        ...message,
        message_side: message.sender === Number(this.userId) ? 'sender': 'receiver'
      }));
    });
  }
  
  archiveMessages() {
    this.chatService.getHistory(this.projectId).subscribe((messages: MessageDto[]) => {
      this.historyMessages = messages.map((message: any) => ({
        ...message,
        message_side: message.userId === Number(this.userId) ? 'sender': 'receiver'
      }));
    });
  }
}

