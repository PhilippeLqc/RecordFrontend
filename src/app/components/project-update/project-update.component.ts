import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProjectService } from '../../Service/project.service';
import { ProjectDto } from '../../model/projectDto';
import { Status } from '../../enumTypes/status';
@Component({
  selector: 'app-project-update',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],  templateUrl: './project-update.component.html',
  styleUrl: './project-update.component.css'
})
export class ProjectUpdateComponent implements OnInit {

  @Output() projectCreated = new EventEmitter<void>();
  @Output() projectUpdated = new EventEmitter<ProjectDto>();
  @Input() projectData!: ProjectDto;


  public projectFrom!: FormGroup;
  statusList: string[] = Object.values(Status);


  constructor(private projectService: ProjectService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.projectFrom = this.formBuilder.group({
      id: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      status: [''],
    });

    if (this.projectData) {
      this.projectFrom.setValue({
        id: this.projectData.id,
        title: this.projectData.title,
        description: this.projectData.description,
        status: this.projectData.status,
      });
    }
  }


  onSubmitUpdateProject() {

    let status: Status = Status[this.projectFrom.controls['status'].value as keyof typeof Status];


    let updatedProject: ProjectDto = {
      id: this.projectData.id,
      title: this.projectFrom.controls['title'].value!,
      description: this.projectFrom.controls['description'].value || '',
      status: status,
      boardlistIds: this.projectData.boardlistIds,
      userIds: this.projectData.userIds,
    };


    this.projectService.updateCurrentProject(updatedProject).subscribe(() => {
      // Emit the updated task
      this.projectUpdated.emit(updatedProject);
      this.closeModal();
    });
  }


  closeModal(): void {
    this.projectCreated.emit();
  }

}
