import { Component } from '@angular/core';
import { TaskService } from '../../Service/task.service';
import { Status } from '../../enumTypes/status';
import { Hierarchy } from '../../enumTypes/hierarchy';
import { TaskDto } from '../../model/taskDto';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  taskName = new FormControl('', Validators.required);

  constructor(
    private taskS: TaskService,
    private formBuilder: FormBuilder,
  ) {}

  public taskForm = this.formBuilder.group({
    taskId: [],
    taskName: [], // Add this line
    title: [],
    description: [],
    expirationDate: [],
    status: [],
    hierarchy: [],
    listUserId: [],
    boardlistId: []
  });


  onSubmitCreateTask() {

    const taskName = this.taskForm.controls['taskName'].value;

    let task: TaskDto = {
      taskId: 0,
      title: taskName!,
      description: 'This is a sample task description',
      expirationDate: new Date(), // December 31, 2022
      status: Status.ACTIVE,
      hierarchy: Hierarchy.IMPORTANT,
      listUserId: [2, 1],
      boardlistId: 202,
    };
    console.log(task);
    this.taskS.createTask(task).subscribe((newTask) => {
      console.log('Task created: ', newTask);
    });
  }
}
