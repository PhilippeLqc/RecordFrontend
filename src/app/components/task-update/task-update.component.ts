import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';
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
  @Output() taskDeleted = new EventEmitter<number>();

  public taskForm!: FormGroup;
  

  taskName = new FormControl('', Validators.required);

  statusList: string[] = Object.values(StatusTask);
  hierarchyList: string[] = Object.values(Hierarchy);
  userId = JSON.parse(localStorage.getItem('currentUser')!).id;

  listUserId!: number[]
  position!: number;
  UserByProjectId: UserDto[] = [];
  selectedUsers: number[] = []; 

  dropdown: boolean = false;
  statusTask = StatusTask;

  constructor(private taskService: TaskService, private projectService: ProjectService, private formBuilder: FormBuilder) { }

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
        status: this.getStatusValue(this.taskData.status),
        listUserId: this.taskData.listUserId,
        hierarchy: this.taskData.hierarchy,
      });
    }
    this.getUserByProjectId(this.projectService.currentProject.id);
    this.taskService.task$.subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }

  getStatusValue(key: string): string {

    return this.statusTask[key as keyof typeof StatusTask];
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
  }

  onSubmitUpdateTask() {
    const expirationDateControl = this.taskForm.get('expirationDate');
    let  dateValue = new Date();
    if (expirationDateControl && expirationDateControl.value) {
      dateValue = new Date(expirationDateControl.value);
    }

    let statusValue = this.taskForm.controls['status'].value;
    let statusKey = Object.keys(StatusTask).find(key => StatusTask[key as keyof typeof StatusTask] === statusValue);
    let hierarchy: Hierarchy = Hierarchy[this.taskForm.controls['hierarchy'].value as keyof typeof Hierarchy];

    let updatedTask: TaskDto = {
      taskId: this.taskData.taskId,
      title: this.taskForm.controls['title'].value!,
      description: this.taskForm.controls['description'].value || '',
      position: this.taskData.position,
      expirationDate: dateValue,
      status: statusKey as unknown as StatusTask,
      hierarchy: hierarchy,
      listUserId: this.selectedUsers,
      boardlistId: this.taskData.boardlistId,
    };

    this.taskService.updateTask(updatedTask).subscribe(() => {
      // Emit the updated task
      this.taskUpdated.emit(updatedTask);
      this.closeModal();
    });
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskData.taskId).subscribe(() => {
      this.taskDeleted.emit(this.taskData.taskId);
      this.closeModal();
    });
  }

  closeModal(): void {
    this.taskCreated.emit();
  }
}
