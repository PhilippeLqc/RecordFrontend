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
  styles = ['style1', 'style2', 'style3', 'style4', 'style5'];

  activeProjects = this.userProjects.pipe(map(projects => projects.filter(project => project.status === 'ACTIVE')));
  archivedProjects = this.userProjects.pipe(map(projects => projects.filter(project => project.status === 'ARCHIVED')));
  
  showModal: boolean = false;
  showUpdate: boolean = false;
  showModalDeleteProject: boolean = false;

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
      console.log('UserID:', userId); // Ajoutez cette ligne pour afficher l'ID de l'utilisateur
      this.projectS.getProjectsByUserId(userId).subscribe((userProject) => {
        console.log('UserProject:', userProject); // Ajoutez cette ligne pour afficher les projets de l'utilisateur
        this.listAllProjectsUsers = userProject;
        this.projectS.userProjects$.subscribe((userProjects) => {
          console.log('UserProjects:', userProjects); // Ajoutez cette ligne pour afficher les projets de l'utilisateur
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

  getRandomStyle() {
    return this.styles[Math.floor(Math.random() * this.styles.length)];
  }

  onSubmit(): void {
    let project = {
      id: 0,
      title: this.projectForm.value.title!,
      description: this.projectForm.value.description!,
      backgroundStyle: this.getRandomStyle(),
      status: 'ACTIVE' as Status,
      boardlistIds: [],
      userIds: []
    }
    this.projectS.createProject(project).subscribe();
  }


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

  deleteFromProjectMenu(projectId: number) {
    this.deleteProject(projectId);
    this.selectedProjectId = -1;
  }

  // Modal

  openModal(): void {
    this.showModal = true;
    this.selectedProjectId = -1;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
