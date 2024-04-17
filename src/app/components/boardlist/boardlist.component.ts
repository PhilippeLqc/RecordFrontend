import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BoardlistService } from '../../Service/boardlist.service';
import { ActivatedRoute } from '@angular/router';
import { BoardListDto } from '../../model/boardListDto';
import { concatMap, filter, from, map, merge, mergeMap, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { TaskComponent } from "../task/task.component";
import { TaskService } from '../../Service/task.service';
import { TaskDto } from '../../model/taskDto';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-boardlist',
    standalone: true,
    templateUrl: './boardlist.component.html',
    styleUrl: './boardlist.component.css',
    imports: [
      CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        DragDropModule,
        CdkDrag,
        CdkDropList,
        TaskComponent
    ]
})

export class BoardlistComponent implements OnInit {

  // Variables
  boardlistsProject: BoardListDto[] = [];
  projectId: Number = Number(this.route.snapshot.paramMap.get('projectId'));
  boardlistForm: FormGroup = new FormGroup({});
  nameBoardlist = new FormControl('', Validators.required);
  tasks: { [boardlistId: number]: TaskDto[] } = {};
  boardlistIdFormName!: Number;

drop(event: CdkDragDrop<any>) {

  if (event.previousContainer === event.container) {
    moveItemInArray(
      event.container.data, 
      event.previousIndex, 
      event.currentIndex);
    // console.log("moveItemInArray", event.container.data);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    // console.log("transferArrayItem", event.container.data);
  }
  for (let i = 0; i < event.container.data.length; i++) {
    const task = event.container.data[i];
    task.position = i;
    task.boardlistId = Number(event.container.id);

      this.taskService.updateTask(task).subscribe();

  }
}

  // Constructor
  constructor(
    public boardlistS: BoardlistService,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {

    merge(this.nameBoardlist.statusChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateErrorName());

  }
  
  ngOnInit(): void {
    this.taskService.currentTask$.subscribe(task => {
      const tasksForBoardlist = this.tasks[task.boardlistId] || [];
      const taskIndex = tasksForBoardlist.findIndex(t => t.taskId === task.taskId);
      if (taskIndex > -1) {
        // Task already exists, update it
        tasksForBoardlist[taskIndex] = task;
      } else {
        // Task does not exist, add it
        this.tasks[task.boardlistId] = [...tasksForBoardlist, task];
      }
      this.tasks[task.boardlistId] = tasksForBoardlist;
    });
    
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.boardlistS.getBoardlistsByProjectId(projectId).pipe(
      switchMap(boardlists => {
        this.boardlistsProject = boardlists;
        return from(boardlists);
      }),
      mergeMap(boardlist => 
        this.taskService.getTasksByBoardlistId(boardlist.id).pipe(
          tap(tasks => console.log('tasks for boardlist', boardlist.id, tasks)),
          map(tasks => ({ boardlist, tasks: tasks.sort((a, b) => a.position - b.position) }))
        )
      )
    ).subscribe(({ boardlist, tasks }) => {
      this.tasks[boardlist.id] = tasks;
    });
    
    this.boardlistForm = this.formBuilder.group({
      boardlistName: ['', Validators.required]
    });

  }

  updateErrorName(): void {
    if (this.nameBoardlist.hasError('required')) {
      console.log('You must enter a name');
    }
  }

  onSubmitBoardlist() {
    if (this.boardlistForm.invalid) {
      this.updateErrorName();
      return;
    }
    let boardlist = {
      id: 0,
      name: this.boardlistForm.controls['boardlistName'].value!,
      projectId: Number(this.projectId),
    };
    this.boardlistS.createBoardlist(boardlist).subscribe((newBoardlist) => {
      this.boardlistsProject.push(newBoardlist);
    });
  }

  showBoardlistNameFormFn(boardlistId: Number) {
    this.boardlistIdFormName = boardlistId;
  }

  updateBoardlistName(boardlist: BoardListDto, boardlistName: string, boardlistId: Number) {
    boardlist.name = boardlistName;
    this.boardlistS.updateBoardlistName(boardlist, boardlistId).subscribe();
    this.boardlistIdFormName = -1;
  }
}

