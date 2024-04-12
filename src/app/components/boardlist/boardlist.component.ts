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
import { merge } from 'rxjs';
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

drop(event: CdkDragDrop<any>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    console.log('moveItemInArray', event.container.data);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    console.log('transferArrayItem', event.container.data);
  }
}

  // Variables
  boardlistsProject: BoardListDto[] = [];
  projectId: Number = Number(this.route.snapshot.paramMap.get('projectId'));
  boardlistForm: FormGroup = new FormGroup({});
  nameBoardlist = new FormControl('', Validators.required);
  tasks: { [boardlistId: number]: TaskDto[] } = {};

  
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
  
  // On Init
  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.boardlistS.getBoardlistsByProjectId(projectId).subscribe(boardlists => {
      this.boardlistsProject = boardlists;
      boardlists.forEach(boardlist => {
        this.taskService.getTasksByBoardlistId(boardlist.id).subscribe(tasks => {
          this.tasks[boardlist.id] = tasks;
          console.log('boardlist task array', this.tasks);
        });
      });
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

    // Get the boardlist name from the form
    console.log('enter on submit');

    let boardlist = {
      id: 0,
      name: this.boardlistForm.controls['boardlistName'].value!,
      projectId: Number(this.projectId),
    };
    console.log('after form ', boardlist);

    // Do something with the boardlist name
    this.boardlistS.createBoardlist(boardlist).subscribe((newBoardlist) => {
      this.boardlistsProject.push(newBoardlist);
    });
    console.log('end service ');
  }
}

