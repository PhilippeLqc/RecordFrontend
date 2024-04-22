import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TaskService } from '../../Service/task.service';
import { TaskDto } from '../../model/taskDto';
import { Hierarchy } from '../../enumTypes/hierarchy';
import { ProjectService } from '../../Service/project.service';
import { UserDto } from '../../model/userDto';
import { StatusTask } from '../../enumTypes/statusTask';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit{

  @Input() boardlistId!: number;
  @Input() tasks!: TaskDto[];
  @Input() taskIdFromBoardlist!: number;

  @Output() taskCreated = new EventEmitter<void>();

  private tasksSubject:  BehaviorSubject<TaskDto[]> = new BehaviorSubject<TaskDto[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  taskName = new FormControl('', Validators.required);
  statusList: string[]= Object.values(StatusTask);
  hierarchyList: string[] = Object.values(Hierarchy);
  listUserId!: number[];
  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  tasksList: TaskDto[] = [];
  UserByProjectId: UserDto[] = [];
  selectedUsers: number[] = [];  
  dropdown: boolean = false;

  constructor( private task: TaskService, private formBuilder: FormBuilder, private projectService: ProjectService ) { }

  ngOnInit(): void {
    if (this.projectService.currentProject) {
      this.getUserByProjectId(this.projectService.currentProject.id);
    }
   }

  public taskForm = this.formBuilder.group({
    taskId: [''],
    title: [''],
    description: [''],
    expirationDate: [''],
    status: [''],
    hierarchy: [''],
    listUserId: this.formBuilder.array([]), // default value
    boardlistId: ['']
  });

  toggleDropdown() {
    this.dropdown = !this.dropdown;
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

  onSubmitCreateTask() {
    const taskName = this.taskForm.controls['title'].value;
    const taskDescription = this.taskForm.controls['description'].value;

    let newTask: TaskDto = {
      taskId: 0,
      title: taskName!,
      description: taskDescription || '',
      position: 0,
      expirationDate: new Date(),
      status: StatusTask.TODO,
      hierarchy: Hierarchy.MOYENNE,
      listUserId: this.selectedUsers,
      boardlistId: this.boardlistId,
    };
    this.task.createTask(newTask).subscribe((newTaskResponse) => {
      const currentTasks = this.tasksSubject.getValue();
      this.tasksSubject.next([...currentTasks, newTaskResponse]);
    });
  }

  getUserByProjectId(projectId: number) {
    return this.projectService.getUsersByProjectId(projectId).subscribe((response) => {
      this.UserByProjectId = response;
    });
  }


  closeModal(): void {
    this.taskCreated.emit();
  }
}
