import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardListDto } from '../model/boardListDto';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BoardlistService {
  boardlistServiceUrl = 'http://localhost:8081/api/boardlist';
  currentBoardlist?: BoardListDto;
  private allBoardlistsOfProjectSubject: BehaviorSubject<BoardListDto[]> =
    new BehaviorSubject<BoardListDto[]>([]);
  allBoardlistsOfProject$ = this.allBoardlistsOfProjectSubject.asObservable();

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  //create a boardlist
  createBoardlist(boardlist: BoardListDto): Observable<BoardListDto> {
    return this.http
      .post<BoardListDto>(`${this.boardlistServiceUrl}/create`, boardlist)
      .pipe(
        tap((response) => {
          this.currentBoardlist = response;
        })
      );
  }

  //get all boardlists by project id
  getBoardlistsByProjectId(projectId: number): Observable<BoardListDto[]> {
    return this.http
      .get<BoardListDto[]>(`${this.boardlistServiceUrl}/project/${projectId}`)
      .pipe(
        tap((response) => {
          this.allBoardlistsOfProjectSubject.next(response);
        })
      );
  }

  // Update boardlist name
  updateBoardlistName(
    boardlist: BoardListDto,
    boardlistId: Number
  ): Observable<BoardListDto> {
    return this.http
      .put<BoardListDto>(
        `${this.boardlistServiceUrl}/update/${boardlistId}`,
        boardlist
      )
      .pipe(
        tap((response) => {
          this.currentBoardlist = response;
        })
      );
  }

  // Delete boardlist
  deleteBoardlist(boardlistId: Number): void {
    this.http
      .delete<BoardListDto>(`${this.boardlistServiceUrl}/delete/${boardlistId}`)
      .subscribe(() => {
        this.allBoardlistsOfProjectSubject.next(
          this.allBoardlistsOfProjectSubject.value.filter(
            (boardlist) => boardlist.id !== boardlistId
          )
        );
      });
  }
}
