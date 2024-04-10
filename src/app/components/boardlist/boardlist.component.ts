import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BoardlistService } from '../../Service/boardlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardListDto } from '../../model/boardListDto';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-boardlist',
  standalone: true,
  imports: [],
  templateUrl: './boardlist.component.html',
  styleUrl: './boardlist.component.css',
})

export class BoardlistComponent implements OnInit {
  constructor(
    public boardlistS: BoardlistService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    merge(this.name.statusChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorName());
  }

  // In BoardlistComponent
  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    this.boardlistS.getBoardlistsByProjectId(projectId).subscribe(() => {
      this.boardlistsProject = this.boardlistS.allBoardlistsOfProject;
    });
  }

  boardlistsProject: BoardListDto[] = [];
  name = new FormControl('', Validators.required);
  errorMessage = '';
  projectId: Number = Number(this.route.snapshot.paramMap.get('projectId'));

  public boardlistForm = this.formBuilder.group({
    name: [''],
    projectId: this.projectId,
  });

  updateErrorName(): void {
    if (this.name.hasError('required')) {
      this.errorMessage = 'You must enter a name';
    }
  }

  onSubmit() {
    const projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    let boardlist = {
      name: this.boardlistForm.value.name!,
      projectId: projectId,
    };
    this.boardlistS
      .createBoardlist(boardlist, projectId)
      .subscribe((newBoardlist) => {
        this.boardlistsProject.push(newBoardlist);
      });
  }
}
