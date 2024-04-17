import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../Service/project.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Status } from '../../enumTypes/status';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { ProjectDto } from '../../model/projectDto';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [FormsModule,
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit{
  
  userProjects: ProjectDto[] = [];
  title = new FormControl('', Validators.required);
  errorMessage = '';

  constructor(
    private project: ProjectService,
    private formBuilder: FormBuilder,
    private router: Router) {
      merge(this.title.statusChanges, this.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorTitle());
     }

  ngOnInit(): void {
    this.project.getProjectsByUserId().subscribe((userProject) => {
      this.userProjects  = userProject;
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
      this.userProjects = [...this.userProjects, newProject];
    });
  }

  gotoProject(projectId: ProjectDto): void {
    this.project.changeCurrentProject(projectId);
    this.router.navigate(['/project', projectId.id]);
  }

}
