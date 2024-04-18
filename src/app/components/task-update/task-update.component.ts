import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskService } from '../../Service/task.service';
import { Status } from '../../enumTypes/status';
import { Hierarchy } from '../../enumTypes/hierarchy';
import { TaskDto } from '../../model/taskDto';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject } from 'rxjs';

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
  private tasksSubject: BehaviorSubject<TaskDto[]> = new BehaviorSubject<
    TaskDto[]
  >([]);

  tasks$ = this.tasksSubject.asObservable();
  taskName = new FormControl('', Validators.required);
  statusList: string[] = Object.values(Status);
  hierarchyList: string[] = Object.values(Hierarchy);
  userId = JSON.parse(localStorage.getItem('currentUser')!).id;
  position!: number;

  constructor(private task: TaskService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    console.log('liste de tache', this.taskData);
  }

  public taskForm = this.formBuilder.group({
    taskId: [''],
    title: [''],
    description: [''],
    expirationDate: [''],
    status: [''],
    hierarchy: [''],
    listUserId: [''],
    boardlistId: [''],
  });

  onSubmitCreateTask() {
    const taskName = this.taskForm.controls['title'].value;
    const taskDescription = this.taskForm.controls['description'].value;

    let newTask: TaskDto = {
      taskId: 0,
      title: taskName!,
      description: taskDescription || '',
      position: 0,
      expirationDate: new Date(),
      status: Status.ACTIVE,
      hierarchy: Hierarchy.MOYENNE,
      listUserId: [this.userId],
      boardlistId: this.boardlistId,
    };
    this.task.createTask(newTask).subscribe((newTaskResponse) => {
      const currentTasks = this.tasksSubject.getValue();
      this.tasksSubject.next([...currentTasks, newTaskResponse]);
    });
  }

  logChange(value: any) {
    console.log(value);
  }

  logChanges(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(target.value);
  }

  onSubmitUpdateTask() {

    // let updatedTask: TaskDto = {
    //   taskId: this.taskData.taskId,
    //   title: this.taskForm.controls['title'].value!,
    //   description: this.taskForm.controls['description'].value || '',
    //   position: this.taskForm.controls['position'].value,
    //   expirationDate: this.taskForm.controls['expirationDate'].value,
    //   status: this.taskForm.controls['status'].value,
    //   hierarchy: this.taskForm.controls['hierarchy'].value,
    //   listUserId: [this.userId],
    //   boardlistId: this.boardlistId,
    // };

    // this.task.updateTask(updatedTask).subscribe((updatedTaskResponse) => {
    //   const currentTasks = this.tasksSubject.getValue();
    //   const updatedTasks = currentTasks.map((task) =>
    //     task.taskId === updatedTaskResponse.taskId ? updatedTaskResponse : task
    //   );
    //   this.tasksSubject.next(updatedTasks);
    // });
  }

  closeModal(): void {
    this.taskCreated.emit();
  }
}
