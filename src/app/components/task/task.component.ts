import { Component } from '@angular/core';
import { TaskService } from '../../Service/task.service';
import { Status } from '../../enumTypes/status';
import { Hierarchy } from '../../enumTypes/hierarchy';
import { TaskDto } from '../../model/taskDto';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  constructor(
    public taskS: TaskService,
  ){}


  onSubmitCreateTask(){
    let task: TaskDto = {
      taskId: 4546115165,
      title: "Sample Task",
      description: "This is a sample task description",
      expirationDate: new Date(), // December 31, 2022
      status: Status.ACTIVE,
      hierarchy: Hierarchy.IMPORTANT,
      userId: [4652],
      boardlistId: 206
    };
    console.log(task);
    this.taskS.createTask(task).subscribe((newTask) => {
      console.log("Task created: ", newTask);
    });
  }
}
