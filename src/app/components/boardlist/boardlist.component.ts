import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { from, map, merge, mergeMap, switchMap, tap } from 'rxjs';
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
import { ModalComponent } from '../../lib/modal/modal.component';
import { TaskUpdateComponent } from "../task-update/task-update.component";

@Component({
    selector: 'app-boardlist',
    standalone: true,
    templateUrl: './boardlist.component.html',
    styleUrl: './boardlist.component.css',
    imports: [
        ModalComponent,
        TaskComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        DragDropModule,
        CdkDrag,
        CdkDropList,
        TaskUpdateComponent
    ]
})

export class BoardlistComponent implements OnInit {

  // Variables
  boardlistsProject: BoardListDto[] = [];
  selectedBoardlistId!: number;
  selectedTask!: number;
  showUpdate: boolean = false;
  projectId: Number = Number(this.route.snapshot.paramMap.get('projectId'));
  boardlistForm: FormGroup = new FormGroup({});
  nameBoardlist = new FormControl('', Validators.required);
  tasks: { [boardlistId: number]: TaskDto[] } = {};
  task!: TaskDto;
  boardlistIdFormName!: Number;
  showModal = false;
  showCreateListModal = false;
  showBoardlistMenu!: Number;

  selectedTaskData!: TaskDto; // Remplacez Task par le type de vos tâches


  dropList(event: CdkDragDrop<any[]>) {
    {
      moveItemInArray(this.boardlistsProject, event.previousIndex, event.currentIndex);
    }
  }

dropTasks(event: CdkDragDrop<any>) {

  if (event.previousContainer === event.container) {
    moveItemInArray(
      event.container.data, 
      event.previousIndex, 
      event.currentIndex);
    console.log("moveItemInArray", event.container.data);
  } else {
    if (event.previousContainer.data && event.container.data) { // Ajoutez cette vérification
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      console.log("transferArrayItem", event.container.data);
    }
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

  // OnInit
  
  ngOnInit(): void {
    merge(
      this.taskService.currentTask$.pipe(
        tap(task => {
          const tasksForBoardlist = this.tasks[task.boardlistId] || [];
          const taskIndex = tasksForBoardlist.findIndex(t => t.taskId === task.taskId);
          if (taskIndex > -1) {
            // Task already exists, update it
            tasksForBoardlist[taskIndex] = task;
          } else {
            // Task does not exist, add it
            this.tasks[task.boardlistId] = [...tasksForBoardlist, task];
          }
        })
      ),
      this.boardlistS.allBoardlistsOfProject$.pipe(
        tap(boardlists => {
          this.boardlistsProject = boardlists;
        })
      )
    ).subscribe();
    
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

  // Method Form Boardlist

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
      this.boardlistsProject = [...this.boardlistsProject, newBoardlist];
      console.log('boardlistsProject', this.boardlistsProject); 
      this.tasks[newBoardlist.id] = [];
    });

    this.boardlistForm.reset();
  }

  // Modal

  openModal(boardlistId: number): void {
    this.selectedBoardlistId = boardlistId;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showUpdate = false;
  }

  openCreateListModal(): void {
    this.showCreateListModal = !this.showCreateListModal;
  }

  // openUpdateModal(taskId: number): void {
  //   this.showUpdate = true;
  //   this.selectedTask = taskId;
  //   this.showModal = true;
  // }

  openUpdateModal(taskId: number, boardListId: number): void {
    this.showModal = true;
    this.showUpdate = true;
    const task = this.tasks[boardListId].find(t => t.taskId === taskId);
    if (task) {
      this.selectedTaskData = task;
    }
  }


  // Edit or Delete Boardlist

  showBoardlistNameFormFn(boardlistId: Number) {
    this.boardlistIdFormName = boardlistId;
  }

  updateBoardlistName(boardlist: BoardListDto, boardlistName: string, boardlistId: Number) {
    boardlist.name = boardlistName;
    this.boardlistS.updateBoardlistName(boardlist, boardlistId).subscribe();
    this.boardlistIdFormName = -1;
  }

  deleteBoardlist(boardlistId: Number) {
    this.boardlistS.deleteBoardlist(boardlistId);
  }


  // Boardlist menu

  showEditBoardlistMenu(boardlistId: Number) {
    this.showBoardlistMenu = boardlistId;
  }

  editFromBoardlistMenu(boardlistId: Number) {
    this.boardlistIdFormName = boardlistId;
    this.showBoardlistMenu = -1;
  }

  
  deleteFromBoardlistMenu(boardlistId: Number) {
    this.deleteBoardlist(boardlistId)
    this.showBoardlistMenu = -1;
  }
}

