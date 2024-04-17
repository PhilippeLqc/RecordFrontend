import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskDto } from '../model/taskDto';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskUrl = 'http://localhost:8081/api/task';

  private currentTaskSubject: BehaviorSubject<TaskDto> = new BehaviorSubject<TaskDto>({} as TaskDto);
  currentTask$ = this.currentTaskSubject.asObservable();
  allTasksOfBoardlist: TaskDto[] = [];

  constructor(private http: HttpClient) {}

    createTask(task: TaskDto): Observable<TaskDto> {
      return this.http.post<TaskDto>(`${this.taskUrl}/create`, task).pipe(
          tap((response) => {
              this.currentTaskSubject.next(response);
          })
      );
    }

    updateTask(task: TaskDto): Observable<TaskDto> {
        return this.http.put<TaskDto>(`${this.taskUrl}/update/${task.taskId}`, task).pipe(
            tap((response) => {
                this.currentTaskSubject.next(response);
            })
        );
    }

    getTasksByBoardlistId(boardlistId: number): Observable<TaskDto[]> {
        return this.http.get<TaskDto[]>(`${this.taskUrl}/boardlist/${boardlistId}`).pipe(
            tap((response) => {
                this.allTasksOfBoardlist = response;
          })
      );
    }
}
