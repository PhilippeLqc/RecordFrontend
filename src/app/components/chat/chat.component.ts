import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../Service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageDto } from '../../model/messageDto';
import { ProjectDto } from '../../model/projectDto';
import { ProjectService } from '../../Service/project.service';
import { MessageDtoCustom } from '../../model/MessageDtoCustom';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  currentProject: ProjectDto = {} as  ProjectDto
  messageList: MessageDtoCustom[] = [];
  historyMessages: MessageDtoCustom[] = [];
  userMessage: string = ''; // Propriété pour stocker la valeur de l'entrée de texte
  
  constructor(
  private chatService: ChatService,  
  private project: ProjectService) { }
    
    ngOnInit(): void {
      this.project.currentProject$.subscribe((project) => {this.currentProject = project});
      this.chatService.joinRoom(`${this.currentProject.id}`);
      this.archiveMessages();
      this.listenerMessages();
    }

    ngOnDestroy(): void {
      this.chatService.closeConnection(this.currentProject.id);
    }
    
    sendMessage() {
      const messageDto: MessageDto = {
        id: 0,
        message: this.userMessage,
        projectId: this.currentProject.id,
        userId: this.userId
    }
    this.chatService.sendMessage(messageDto.projectId, messageDto);
    this.userMessage = '';
  }
  
  
  listenerMessages() {
    this.chatService.getMessages().subscribe((messages: MessageDto[]) => {
      this.messageList = messages.map((message: any) => ({
        ...message,
        message_side: message.sender === Number(this.userId) ? 'sender': 'receiver'
      }));
    });
  }
  
  archiveMessages() {
    this.chatService.getHistory(`${this.currentProject.id}`).subscribe((messages: MessageDto[]) => {
      this.historyMessages = messages.map((message: any) => ({
        ...message,
        message_side: message.userId === Number(this.userId) ? 'sender': 'receiver'
      }));
    });
  }
}

