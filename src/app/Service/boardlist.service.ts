import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { BoardListDto } from "../model/boardListDto";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoardlistService {
    constructor(private http: HttpClient, private auth: AuthService) {
        this.currentBoardlistDto = {
            name: '',
            projectId: 0
        }
     }

    boardlistServiceUrl = 'http://localhost:8081/api/boardlist';
    currentBoardlistDto: BoardListDto;
    currentBoardlist?: BoardListDto;
    userBoardlists: BoardListDto[] = [];

    //create a boardlist
    createBoardlist(boardlist: BoardListDto): Observable<BoardListDto> {
        return this.http.post<BoardListDto>(this.boardlistServiceUrl + '/create', boardlist).pipe(
            tap((response) => {
                this.currentBoardlist = response
            })
        );
    }

  constructor() { }
}
