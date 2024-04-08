import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../Service/project.service';
import { UserService } from '../../Service/user.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../model/project';
import { Status } from '../../enumTypes/status';
import { ProjectDto } from '../../model/projectDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit{

  constructor(public project: ProjectService, private userDetails: UserService, private route: ActivatedRoute) {
    this.projectDetails = {
      id: 0,
      title: '',
      description: '',
      status: 'ACTIVE'as Status,
      boardlistIds: [],
      userIds: []
    }
   }

  projectDetails: ProjectDto;

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    if (projectId !== null) {
      this.project.getProjectById(Number(projectId)).subscribe((response) => {
        console.log("APPEL DE LA FONCTION");
        this.projectDetails = response;
        console.log("APPEL DE LA REPONSE", this.projectDetails);
      });
    }
  }
}
