import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BoardlistService } from '../../Service/boardlist.service';
import { ActivatedRoute } from '@angular/router';
import { BoardListDto } from '../../model/boardListDto';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-boardlist',
  standalone: true,
  imports: [ 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './boardlist.component.html',
  styleUrl: './boardlist.component.css',
})

export class BoardlistComponent implements OnInit {

  // Variables
  boardlistsProject: BoardListDto[] = [];
  name = new FormControl('', Validators.required);
  errorMessage = '';
  projectId: Number = Number(this.route.snapshot.paramMap.get('projectId'));
  registerForm: any;


  // Constructor
  constructor(
    public boardlistS: BoardlistService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    merge(this.name.statusChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorName());
  }

  // On Init
  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.boardlistS.getBoardlistsByProjectId(projectId).subscribe(() => {
      this.boardlistsProject = this.boardlistS.allBoardlistsOfProject;
    });
  }

  // Form
  public boardlistForm = this.formBuilder.group({
    boardlistName: ["", [Validators.required]],
    projectId: this.projectId!,
  });

  updateErrorName(): void {
    if (this.name.hasError('required')) {
      this.errorMessage = 'You must enter a name';
    }
  }

  onSubmitBoardlist() {
    console.log("enter on submit")

    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    let boardlist = {
      name: this.boardlistForm.value.boardlistName!,
      projectId: projectId!,
    };
    console.log("after form ", boardlist);

    this.boardlistS
      .createBoardlist(boardlist)
      .subscribe((newBoardlist) => {
        this.boardlistsProject.push(newBoardlist);
      });
      console.log("end service ");
  }
}
