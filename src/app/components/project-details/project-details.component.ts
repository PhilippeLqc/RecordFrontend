import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../Service/project.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectDto } from '../../model/projectDto';
import { CommonModule } from '@angular/common';
import { BoardlistComponent } from '../boardlist/boardlist.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { FooterComponent } from '../layouts/footer/footer.component';
import { ChatComponent } from '../chat/chat.component';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, BoardlistComponent, HeaderComponent, FooterComponent, ChatComponent, CdkDrag],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit{

  constructor(public project: ProjectService, private route: ActivatedRoute) {
  }
  
  projectDetails?: ProjectDto;
  showChat = false;
  dragging = false;

  togleChat() {
    this.showChat = !this.showChat
  }

  onDragStart() {
    this.dragging = true;
  }
  
  onDragEnd() {
    setTimeout(() => {
      this.dragging = false;
    }, 100);
  }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId !== null) {
      this.project.getProjectById(Number(projectId)).subscribe((response) => {
        this.projectDetails = response;
      });
    }
  }
}
