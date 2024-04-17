    import { HttpClient } from "@angular/common/http";
    import { Injectable } from "@angular/core";
    import { BoardListDto } from "../model/boardListDto";
    import { Observable, tap } from "rxjs";
    import { ActivatedRoute } from "@angular/router";

    @Injectable({
        providedIn: 'root'
    })

    export class BoardlistService {
        constructor(private http: HttpClient, private route: ActivatedRoute) {
        }

        boardlistServiceUrl = 'http://localhost:8081/api/boardlist';
        currentBoardlistDto!: BoardListDto;
        currentBoardlist?: BoardListDto;
        allBoardlistsOfProject: BoardListDto[] = [];
        projectId: number = Number(this.route.snapshot.paramMap.get('projectId'));

        //create a boardlist
        createBoardlist(boardlist: BoardListDto): Observable<BoardListDto> {
            return this.http.post<BoardListDto>(`${this.boardlistServiceUrl}/create`, boardlist).pipe(
                tap((response) => {
                    this.currentBoardlist = response
                })
            );
        }

        //get all boardlists by project id
        getBoardlistsByProjectId(projectId: number): Observable<BoardListDto[]> {
            return this.http.get<BoardListDto[]>(`${this.boardlistServiceUrl}/project/${projectId}`).pipe(
                tap((response) => {
                    this.allBoardlistsOfProject = response;
                })
            );
        }

        // Update boardlist name
        // updateBoardlistName(boardlist: BoardListDto): Observable<BoardListDto> {
        //     return this.http.put<BoardListDto>(`${this.boardlistServiceUrl}/update`, boardlist).pipe(
        //         tap((response) => {
        //             this.currentBoardlist = response
        //         })
        //     );
        // }

        

    }

