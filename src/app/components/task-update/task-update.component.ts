import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TaskService } from '../../Service/task.service';
import { TaskDto } from '../../model/taskDto';
import { Status } from '../../enumTypes/status';
import { Hierarchy } from '../../enumTypes/hierarchy';
import { ProjectService } from '../../Service/project.service';
import { UserDto } from '../../model/userDto';
import { StatusTask } from '../../enumTypes/statusTask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-update',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
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
  statusList: string[] = Object.values(StatusTask);
  hierarchyList: string[] = Object.values(Hierarchy);
  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  listUserId!: number[]
  position!: number;
  UserByProjectId: UserDto[] = [];
  selectedUsers: number[] = [];  
  dropdown: boolean = false;

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
      this.taskForm.patchValue({
        taskId: this.taskData.taskId,
        title: this.taskData.title,
        description: this.taskData.description,
        expirationDate: this.taskData.expirationDate,
        status: this.taskData.status,
        listUserId: this.taskData.listUserId,
        hierarchy: this.taskData.hierarchy,
      });
    }
    this.getUserByProjectId(this.projectService.currentProject.id);
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }

  getUserByProjectId(projectId: number) {
    return this.projectService.getUsersByProjectId(projectId).subscribe((response) => {
      this.UserByProjectId = response;
    });
  }

  onUserSelectionChange(event: Event, userId: number) {
    const checkboxElement = event.target as HTMLInputElement;
  
    if (checkboxElement.checked) {
      // Si la checkbox est cochée, ajouter l'ID de l'utilisateur à selectedUsers
      this.selectedUsers.push(userId);
    } else {
      // Si la checkbox est décochée, supprimer l'ID de l'utilisateur de selectedUsers
      const index = this.selectedUsers.indexOf(userId);
      if (index !== -1) {
        this.selectedUsers.splice(index, 1);
      }
    }
  
    console.log('selectedUsers', this.selectedUsers);
  }

  onSubmitUpdateTask() {
    const expirationDateControl = this.taskForm.get('expirationDate');
    let  dateValue = new Date();
    if (expirationDateControl && expirationDateControl.value) {
      dateValue = new Date(expirationDateControl.value);
    }

    let status: StatusTask = StatusTask[this.taskForm.controls['status'].value as keyof typeof StatusTask];
    let hierarchy: Hierarchy = Hierarchy[this.taskForm.controls['hierarchy'].value as keyof typeof Hierarchy];

    let updatedTask: TaskDto = {
      taskId: this.taskData.taskId,
      title: this.taskForm.controls['title'].value!,
      description: this.taskForm.controls['description'].value || '',
      position: this.taskData.position,
      expirationDate: dateValue,
      status: status,
      hierarchy: hierarchy,
      listUserId: this.selectedUsers,
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
