import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../Service/project.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectDto } from '../../model/projectDto';
import { CommonModule } from '@angular/common';
import { BoardlistComponent } from '../boardlist/boardlist.component';
import { NotificationComponent } from '../notification/notification.component';
import { InvitationprojectComponent } from '../invitationproject/invitationproject.component';
import { ChatService } from '../../Service/chat.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, BoardlistComponent, NotificationComponent, InvitationprojectComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit{

  constructor(public project: ProjectService, private route: ActivatedRoute, private chatService: ChatService) {
  }
  
  projectDetails?: ProjectDto;

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId')!;
    if (projectId !== null) {
      this.project.getProjectById(Number(projectId)).subscribe((response) => {
        this.projectDetails = response;
      });
    }
    this.chatService.joinRoom(projectId);
  }
}
