import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskDto } from '../model/taskDto';
import { Status } from '../enumTypes/status';
import { Hierarchy } from '../enumTypes/hierarchy';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

    boardlistServiceUrl = 'http://localhost:8081/api/task';
    // currentTaskDto: TaskDto;
    currentTask?: TaskDto;
    allTasksOfBoardlist: TaskDto[] = [];

    constructor(private http: HttpClient, private route: ActivatedRoute) {
      //   this.currentTaskDto = {
      //     id: 0,
      //     title: "",
      //     description: "",
      //     expirationDate: Date,
      //     status: Status.ACTIVE,
      //     hierarchy: Hierarchy.IMPORTANT,
      //     userId: number[],
      //     boardListId: number,
    }

    // Get all tasks by boardlist id
    getTasksByBoardlistId(boardlistId: number): Observable<TaskDto[]> {
        return this.http.get<TaskDto[]>(`${this.boardlistServiceUrl}/boardlist/${boardlistId}`).pipe(
            tap((response) => {
                console.log("REPONSE DATA DE GETTASKSBYBOARDLISTID");
                console.log(response);
                this.allTasksOfBoardlist = response;
                console.log("END DATA DE GETTASKSBYBOARDLISTID");
            })
        );
    }
}
