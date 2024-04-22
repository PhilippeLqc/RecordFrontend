import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BehaviorSubject } from 'rxjs';
import { TaskService } from '../../Service/task.service';
import { TaskDto } from '../../model/taskDto';
import { Status } from '../../enumTypes/status';
import { Hierarchy } from '../../enumTypes/hierarchy';
import { ProjectService } from '../../Service/project.service';
import { UserDto } from '../../model/userDto';

@Component({
  selector: 'app-task-update',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './task-update.component.html',
  styleUrl: './task-update.component.css',
})
export class TaskUpdateComponent implements OnInit {

  @Input() boardlistId!: number;
  @Input() tasks!: TaskDto[];
  @Input() taskIdFromBoardlist!: number;
  @Input() taskData!: TaskDto;

  @Output() taskCreated = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<TaskDto>();

  private tasksSubject: BehaviorSubject<TaskDto[]> = new BehaviorSubject<TaskDto[]>([]);
  public taskForm!: FormGroup;
  
  tasks$ = this.tasksSubject.asObservable();
  taskName = new FormControl('', Validators.required);
  statusList: string[] = Object.values(Status);
  hierarchyList: string[] = Object.values(Hierarchy);
  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  listUserId!: number[]
  position!: number;
  UserByProjectId: UserDto[] = [];

  constructor(private task: TaskService, private projectService: ProjectService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.listUserId = this.taskData.listUserId;
    this.taskForm = this.formBuilder.group({
      taskId: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      expirationDate: ['', Validators.required],
      listUserId: [''],
      status: [''],
      hierarchy: [''],
    });

    if (this.taskData) {
      this.taskForm.setValue({
        taskId: this.taskData.taskId,
        title: this.taskData.title,
        description: this.taskData.description,
        expirationDate: this.taskData.expirationDate,
        status: this.taskData.status,
        listUserId: this.taskData.listUserId,
        hierarchy: this.taskData.hierarchy,
      });
    }

    this.projectService.currentProject$.subscribe((project) => {
      // console.log('Current project', project);
      this.getUserByPRojectId(project.id);
    });
  }

  getUserByPRojectId(projectId: number) {
    return this.projectService.getUsersByProjectId(projectId).subscribe((response) => {
      this.UserByProjectId = response;
      console.log('Users by project', this.UserByProjectId);
    });
  }

  onSubmitUpdateTask() {
    const expirationDateControl = this.taskForm.get('expirationDate');
    let  dateValue = new Date();
    if (expirationDateControl && expirationDateControl.value) {
      dateValue = new Date(expirationDateControl.value);
    }

    let status: Status = Status[this.taskForm.controls['status'].value as keyof typeof Status];
    let hierarchy: Hierarchy = Hierarchy[this.taskForm.controls['hierarchy'].value as keyof typeof Hierarchy];

    let updatedTask: TaskDto = {
      taskId: this.taskData.taskId,
      title: this.taskForm.controls['title'].value!,
      description: this.taskForm.controls['description'].value || '',
      position: this.taskData.position,
      expirationDate: dateValue,
      status: status,
      hierarchy: hierarchy,
      // listUserId: this.taskForm.controls['listUserId'].value,
      listUserId: this.taskData.listUserId,
      boardlistId: this.taskData.boardlistId,
    };

    this.task.updateTask(updatedTask).subscribe(() => {
      // Emit the updated task
      this.taskUpdated.emit(updatedTask);
      this.closeModal();
    });
  }

  closeModal(): void {
    this.taskCreated.emit();
  }
}
