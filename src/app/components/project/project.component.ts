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
        MatCardModule, HeaderComponent, FooterComponent]
})
export class ProjectComponent implements OnInit{
  
  userProjects = new BehaviorSubject<ProjectDto[]>([]);
  title = new FormControl('', Validators.required);
  errorMessage: string = '';
  showModal: boolean = false;
  selectedProject!: number | null;
  activeProjects = this.userProjects.pipe(map(projects => projects.filter(project => project.status === 'ACTIVE')));
  archivedProjects = this.userProjects.pipe(map(projects => projects.filter(project => project.status === 'ARCHIVED')));
  showUpdate: boolean = false;

  constructor(
    private project: ProjectService,
    private formBuilder: FormBuilder,
    private router: Router,
    public projectS: ProjectService) {
      merge(this.title.statusChanges, this.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorTitle());
     }

  ngOnInit(): void {
    this.project.getProjectsByUserId().subscribe((userProject) => {
      this.userProjects.next(userProject);
      this.project.userProjects$.subscribe((userProjects) => {
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
    console.log('onSubmit was called');
    let project = {
      id: 0,
      title: this.projectForm.value.title!,
      description: this.projectForm.value.description!,
      status: 'ACTIVE' as Status,
      boardlistIds: [],
      userIds: []
    }
    console.log(project);
    
    this.project.createProject(project).subscribe((newProject) => {
      this.userProjects.next([...this.userProjects.getValue(), newProject]);
    });
  }


  // Project menu actions

  toggleMenu(projectId: number): void {
    if (this.selectedProject === projectId) {
      this.selectedProject = null;
    } else {
      this.selectedProject = projectId;
    }
  }
  
  closeMenu(): void {
    this.selectedProject = null;
    this.showUpdate = false;
  }

  gotoProject(projectId: ProjectDto): void {
    this.project.changeCurrentProject(projectId);
    this.router.navigate(['/project', projectId.id]);
  }

  updateProject(projectId: number): void {
    this.selectedProject = projectId;
    this.showModal = true;
    console.log(`Updating project ${this.selectedProject}`);
    
  }

  // deleteProject(projectId: number): void {
  //   console.log(`Enter Deleting project ${projectId}`);
  //   this.selectedProject = projectId;
  //   console.log(`mid Deleting project ${projectId}`);
  //   this.project.createProject(project).subscribe((newProject) => {
  //     this.userProjects.next([...this.userProjects.getValue(), newProject]);
  //   });
  //   this.projectS.deleteProjectById(projectId);
  //   console.log(`end Deleting project ${projectId}`);

  // }
  deleteProject(projectId: number): void {
    console.log(`Enter Deleting project ${projectId}`);
    this.selectedProject = projectId;
    console.log(`mid Deleting project ${projectId}`);
    this.projectS.deleteProjectById(projectId).subscribe(() => {
      console.log(`end Deleting project ${projectId}`);
    });
  }


  // Modal

  openModal(): void {
    console.log('openModal was called');
    this.showModal = true;
  }

  closeModal(): void {
    console.log('closeModal was called');
    this.showModal = false;
  }
}
