import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { BoardListDto } from "../model/boardListDto";
import { Observable, tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class BoardlistService {
    constructor(private http: HttpClient, private auth: AuthService, private route: ActivatedRoute) {
        this.currentBoardlistDto = {
            name: '',
            projectId: Number(this.route.snapshot.paramMap.get('projectId'))
        }
     }

    boardlistServiceUrl = 'http://localhost:8081/api/boardlist';
    currentBoardlistDto: BoardListDto;
    currentBoardlist?: BoardListDto;
    allBoardlistsOfProject: BoardListDto[] = [];

    //create a boardlist
    createBoardlist(boardlist: BoardListDto): Observable<BoardListDto> {
        return this.http.post<BoardListDto>(this.boardlistServiceUrl + '/create', boardlist).pipe(
            tap((response) => {
                this.currentBoardlist = response
            })
        );
    }

    //get all boardlists by project id
    getBoardlistsByProjectId(): Observable<BoardListDto[]> {
        const projectId = this.route.snapshot.paramMap.get('projectId');

        return this.http.get<BoardListDto[]>(this.boardlistServiceUrl + '/project/' + projectId).pipe(
            tap((response) => {
                console.log(response);
                this.allBoardlistsOfProject = response;
            })
        );
    }

}

