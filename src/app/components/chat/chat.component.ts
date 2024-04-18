import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../Service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageDto } from '../../model/messageDto';
import { ProjectDto } from '../../model/projectDto';
import { ProjectService } from '../../Service/project.service';
import { MessageDtoCustom } from '../../model/MessageDtoCustom';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

//  @Input() width: string;
//  @Input() height: string;

  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  private destroy$ = new Subject<void>();
  currentProject: ProjectDto = {} as  ProjectDto
  messageList: MessageDtoCustom[] = [];
  historyMessages: MessageDtoCustom[] = [];
  userMessage: string = ''; // Propriété pour stocker la valeur de l'entrée de texte
  
  constructor(
  private chatService: ChatService,  
  private project: ProjectService,
  private chat: ChatService) { }
    
    ngOnInit(): void {
      this.project.currentProject$.subscribe((project) => {
        this.currentProject = project;
        this.messageList = []
        this.historyMessages = []
        this.chatService.joinRoom(`${this.currentProject.id}`);
        this.archiveMessages();
      });
      
      this.listenerMessages();
      console.log('history', this.historyMessages)
      console.log('messagelist on init', this.messageList)
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
    this.chatService.getMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: MessageDto[]) => {
        this.messageList = messages.map((message: any) => ({
          ...message,
          message_side: message.sender === Number(this.userId) ? 'sender': 'receiver'
        }));
      });
  }
  
  archiveMessages() {
    this.chatService.getHistory(`${this.currentProject.id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: MessageDto[]) => {
        console.log('archivemessage', messages)
        this.historyMessages = messages.map((message: any) => ({
          ...message,
          message_side: message.userId === Number(this.userId) ? 'sender': 'receiver'
        }));
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chatService.closeConnection(this.currentProject.id);
    this.messageList = []
    this.historyMessages = []
    console.log('messagelist ondestroy', this.messageList)
  }
}

