import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../Service/project.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectDto } from '../../model/projectDto';
import { CommonModule } from '@angular/common';
import { BoardlistComponent } from '../boardlist/boardlist.component';
import { NotificationComponent } from '../notification/notification.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, BoardlistComponent, NotificationComponent, ChatComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit{

  constructor(public project: ProjectService, private route: ActivatedRoute) {
  }
  
  projectDetails?: ProjectDto;

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId !== null) {
      this.project.getProjectById(Number(projectId)).subscribe((response) => {
        this.projectDetails = response;
      });
    }
  }
}
