import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskDto } from '../model/taskDto';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskUrl = 'http://localhost:8081/api/task';
  currentTask?: TaskDto;
  allTasksOfBoardlist: TaskDto[] = [];

  constructor(private http: HttpClient) {}

  createTask(task: TaskDto): Observable<TaskDto> {
      return this.http.post<TaskDto>(`${this.taskUrl}/create`, task).pipe(
          tap((response) => {
              console.log("REPONSE DATA DE CREATETASK");
              console.log(response);
              this.currentTask = response;
              console.log("END DATA DE CREATETASK");
          })
      );
  }

  getTasksByBoardlistId(boardlistId: number): Observable<TaskDto[]> {
      return this.http.get<TaskDto[]>(`${this.taskUrl}/boardlist/${boardlistId}`).pipe(
          tap((response) => {
              console.log("REPONSE DATA DE getTASK");
              console.log(response);
              this.allTasksOfBoardlist = response;
              console.log("END DATA DE getTASK");
          })
      );
  }
}
