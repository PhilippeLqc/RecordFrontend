import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../Service/project.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, map, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Status } from '../../enumTypes/status';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { ProjectDto } from '../../model/projectDto';
import { ModalComponent } from '../../lib/modal/modal.component';
import { HeaderComponent } from "../layouts/header/header.component";
import { FooterComponent } from "../layouts/footer/footer.component";
import { ProjectUpdateComponent } from "../project-update/project-update.component";
import { ProjectDetailsComponent } from '../project-details/project-details.component';

@Component({
    selector: 'app-project',
    standalone: true,
    templateUrl: './project.component.html',
    styleUrl: './project.component.css',
    imports: [ModalComponent,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule, HeaderComponent, FooterComponent, ProjectUpdateComponent]
})
export class ProjectComponent implements OnInit{
  
  userProjects = new BehaviorSubject<ProjectDto[]>([]);
  title = new FormControl('', Validators.required);

  errorMessage: string = '';
  selectedProjectId!: number;
  selectedProjectData!: ProjectDto[];
  projectData!: ProjectDto;
  listAllProjectsUsers!: ProjectDto[];

  activeProjects = this.userProjects.pipe(map(projects => projects.filter(project => project.status === 'ACTIVE')));
  archivedProjects = this.userProjects.pipe(map(projects => projects.filter(project => project.status === 'ARCHIVED')));
  
  showModal: boolean = false;
  showUpdate: boolean = false;

  constructor(
    private projectS: ProjectService,
    private formBuilder: FormBuilder,
    private router: Router) {
      merge(this.title.statusChanges, this.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorTitle());
     }

  ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('currentUser')!).id;
    this.projectS.getProjectsByUserId(userId).subscribe((userProject) => {
      this.listAllProjectsUsers = userProject;
      this.projectS.userProjects$.subscribe((userProjects) => {
        this.userProjects.next(userProjects);
      });
    });
  }

  public projectForm = this.formBuilder.group({
    title: [''],
    description: [''],
  });

  updateErrorTitle(): void {
    if (this.title.hasError('required')) {
      this.errorMessage = 'You must enter a title';
    }
  }

  onSubmit(): void {
    let project = {
      id: 0,
      title: this.projectForm.value.title!,
      description: this.projectForm.value.description!,
      status: 'ACTIVE' as Status,
      boardlistIds: [],
      userIds: []
    }
    this.projectS.createProject(project).subscribe();
  }

  // onProjectUpdated(updatedProject: ProjectDto) {
  //   const tasksForBoardlist = this.tasks[updatedProject.id];
  //   if (tasksForBoardlist) {
  //     const index = tasksForBoardlist.findIndex(task => task.taskId === updatedProject.id);
  //     if (index !== -1) {
  //       // Replace the task in the tasks array
  //       tasksForBoardlist[index] = updatedTask;
  //     }
  //   }
  // }


  // Project menu actions

  toggleMenu(projectId: number): void {
    if (this.selectedProjectId === projectId) {
      this.selectedProjectId = -1;
    } else {
      this.selectedProjectId = projectId;
    }
  }
  
  closeMenu(): void {
    this.selectedProjectId = -1;
    this.showUpdate = false;
  }

  gotoProject(projectId: ProjectDto): void {
    this.projectS.changeCurrentProject(projectId);
    this.router.navigate(['/project', projectId.id]);
  }

  updateProject(projectId: number): void {
    this.selectedProjectId = projectId;
    this.showUpdate = true;
    this.showModal = true;
    // this.projectToUpdate = this.listAllProjectsUsers.filter(project => project.id === projectId);
    const projectToUpdate = this.listAllProjectsUsers.find(project => project.id === projectId);
    if(projectToUpdate) {
      this.projectData = projectToUpdate;
    }
  }

  deleteProject(projectId: number): void {
    this.selectedProjectId = projectId;
    this.projectS.deleteProjectById(projectId).subscribe(() => {
      this.userProjects.next(this.userProjects.getValue().filter(project => project.id !== projectId));});
  }


  // Modal

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
