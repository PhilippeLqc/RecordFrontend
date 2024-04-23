import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { BoardlistService } from '../../Service/boardlist.service';
import { ActivatedRoute } from '@angular/router';
import { BoardListDto } from '../../model/boardListDto';
import { concatMap, forkJoin, from, map, merge, mergeMap, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { TaskComponent } from "../task/task.component";
import { TaskService } from '../../Service/task.service';
import { TaskDto } from '../../model/taskDto';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../lib/modal/modal.component';
import { TaskUpdateComponent } from "../task-update/task-update.component";
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { UserService } from '../../Service/user.service';

@Component({
    selector: 'app-boardlist',
    standalone: true,
    templateUrl: './boardlist.component.html',
    styleUrl: './boardlist.component.css',
    imports: [
        ModalComponent,
        TaskComponent,
        TaskDetailsComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
  userNames: { [taskId: number]: string[] } = {};
  isLoading = false

  selectedTaskData!: TaskDto; // Remplacez Task par le type de vos tâches


  dropList(event: CdkDragDrop<any[]>) {
    {
      moveItemInArray(this.boardlistsProject, event.previousIndex, event.currentIndex);
    }
  }

  dropTasks(event: CdkDragDrop<any>) {
    this.isLoading = true;
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
  
  from(event.container.data).pipe(
    concatMap((task, i) => {
      const updatedTask = task as TaskDto;
      updatedTask.position = i;
      updatedTask.boardlistId = Number(event.container.id);
      return this.taskService.updateTaskDragAndDrop(updatedTask);
    })
  ).subscribe({
    complete: () => this.isLoading = false
  });
}

  // Constructor
  constructor(
    public boardlistS: BoardlistService,
    private userService: UserService,
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
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.boardlistS.getBoardlistsByProjectId(projectId).pipe(
      mergeMap(boardlists => {
        this.boardlistsProject = boardlists as BoardListDto[];
        // Create an array of Observables
        const observables = boardlists.map(boardlist => 
          this.taskService.getTasksByBoardlistId(boardlist.id).pipe(
            map(tasks => {
              const sortedTasks = tasks[boardlist.id] ? tasks[boardlist.id].sort((a, b) => a.position - b.position) : [];
              return { boardlist, tasks: sortedTasks };
            })
          )
        );
        // Combine all Observables into one
        return forkJoin(observables);
      })
    ).subscribe(results => {
      // results is an array of the results of each Observable
      results.forEach(({ boardlist, tasks }) => {
        this.tasks[boardlist.id] = tasks;
      });
      this.getTaskUserNames();
    });
    
    this.taskService.TaskSubject.subscribe(updatedTasks => {
      updatedTasks.forEach(task => {
        if (!this.tasks[task.boardlistId]) {
          this.tasks[task.boardlistId] = [];
        }
        const index = this.tasks[task.boardlistId].findIndex(t => t.taskId === task.taskId);
        if (index !== -1) {
          this.tasks[task.boardlistId][index] = task;
        } else {
          this.tasks[task.boardlistId].push(task);
        }
      });
      this.getTaskUserNames();
    });

    this.boardlistForm = this.formBuilder.group({
      boardlistName: ['', Validators.required]
    });

    this.getTaskUserNames();
  }

  getTaskUserNames(): void {
    for (const boardlistId in this.tasks) {
      for (const task of this.tasks[boardlistId]) {
        this.userService.getUserName(task.listUserId).subscribe(userNames => {
          userNames.forEach(userName => {
            if (!this.userNames[task.taskId]) {
              this.userNames[task.taskId] = [];
            }
            if (!this.userNames[task.taskId].includes(userName)) {
              this.userNames[task.taskId].push(userName);
            }
          });
        });
      }
    }
    console.log('userNames', this.userNames);
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

  onTaskUpdated(updatedTask: TaskDto) {
    const tasksForBoardlist = this.tasks[updatedTask.boardlistId];
    if (tasksForBoardlist) {
      const index = tasksForBoardlist.findIndex(task => task.taskId === updatedTask.taskId);
      if (index !== -1) {
        // Replace the task in the tasks array
        tasksForBoardlist[index] = updatedTask;
      }
    }
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
    console.log('showCreateListModal', this.showCreateListModal);
  }

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

