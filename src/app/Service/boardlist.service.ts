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
            this.currentBoardlistDto = {
                name: '',
                projectId: this.projectId
            }
        }

        boardlistServiceUrl = 'http://localhost:8081/api/boardlist';
        currentBoardlistDto: BoardListDto;
        currentBoardlist?: BoardListDto;
        allBoardlistsOfProject: BoardListDto[] = [];
        projectId: number = Number(this.route.snapshot.paramMap.get('projectId'));

        //create a boardlist
        createBoardlist(boardlist: BoardListDto): Observable<BoardListDto> {
            return this.http.post<BoardListDto>(`${this.boardlistServiceUrl}/create`, boardlist).pipe(
                tap((response) => {
                    console.log("REPONSE DATA DE CREATEBOARDLIST");
                    console.log(response);
                    this.currentBoardlist = response
                    console.log("END DATA DE CREATEBOARDLIST");
                })
            );
        }

        //get all boardlists by project id
        getBoardlistsByProjectId(projectId: number): Observable<BoardListDto[]> {
            console.log(this.boardlistServiceUrl + '/project/' + this.projectId);

            return this.http.get<BoardListDto[]>(`${this.boardlistServiceUrl}/project/${projectId}`).pipe(
                tap((response) => {
                    console.log("REPONSE DATA DE CREATEBOARDLIST");

                    console.log(response);
                    this.allBoardlistsOfProject = response;
                    console.log("END DATA DE CREATEBOARDLIST");

                })
            );
        }

    }

