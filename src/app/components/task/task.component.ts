import { Component, Input, OnInit } from '@angular/core';
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
import {MatSelectModule} from '@angular/material/select';
import { AuthService } from '../../Service/auth.service';


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit{

  @Input() boardlistId!: number;
  @Input() tasks!: TaskDto[];
  taskName = new FormControl('', Validators.required);
  statusList: string[]= Object.values(Status);
  userId = this.auth.currentUser.id as number;

  constructor(
    private taskS: TaskService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
   }

  public taskForm = this.formBuilder.group({
    taskId: [''],
    title: [''],
    description: [''],
    expirationDate: [''],
    status: [''],
    hierarchy: [''],
    listUserId: [''],
    boardlistId: ['']
  });


  onSubmitCreateTask() {
    const taskName = this.taskForm.controls['title'].value;
    const taskDescription = this.taskForm.controls['description'].value;

    let task: TaskDto = {
      taskId: 0,
      title: taskName!,
      description: taskDescription || '',
      expirationDate: new Date(),
      status: Status.ACTIVE,
      hierarchy: Hierarchy.MOYENNE,
      listUserId: [this.userId],
      boardlistId: this.boardlistId,
    };
    console.log("boardlistId: ", this.boardlistId);
    console.log(task);
    this.taskS.createTask(task).subscribe((newTask) => {
      console.log('Task created: ', newTask);
      this.tasks.push(newTask);
    });
  }
}
