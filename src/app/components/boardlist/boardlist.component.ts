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
import { ActivatedRoute, Router } from '@angular/router';
import { BoardListDto } from '../../model/boardListDto';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-boardlist',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './boardlist.component.html',
  styleUrl: './boardlist.component.css',
})

export class BoardlistComponent implements OnInit {

  // Variables
  boardlistsProject: BoardListDto[] = [];
  projectId: Number = Number(this.route.snapshot.paramMap.get('projectId'));
  registerForm: FormGroup = new FormGroup({});
  nameBoardlist = new FormControl('', Validators.required);

  // Constructor
  constructor(
    public boardlistS: BoardlistService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    merge(this.nameBoardlist.statusChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorName());
  }

  // In BoardlistComponent
  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));

    this.boardlistS.getBoardlistsByProjectId(projectId).subscribe(() => {
      this.boardlistsProject = this.boardlistS.allBoardlistsOfProject;
    });

    this.registerForm = this.formBuilder.group({
      boardlistName: ['', Validators.required]
    });

  }

  updateErrorName(): void {
    if (this.nameBoardlist.hasError('required')) {
      console.log('You must enter a name');
    }
  }

  onSubmitBoardlist() {
    if (this.registerForm.invalid) {
      this.updateErrorName();
      return;
    }

    // Get the boardlist name from the form
    const boardlistName = this.registerForm.controls['boardlistName'].value;
    console.log('enter on submit');

    let boardlist = {
      name: boardlistName!,
      projectId: this.projectId!,
    };
    console.log('after form ', boardlist);

    // Do something with the boardlist name
    this.boardlistS.createBoardlist(boardlist).subscribe((newBoardlist) => {
      this.boardlistsProject.push(newBoardlist);
    });
    console.log('end service ');
  }
}
