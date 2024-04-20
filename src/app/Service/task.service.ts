import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskDto } from '../model/taskDto';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskUrl = 'http://localhost:8081/api/task';

  public TaskSubject: BehaviorSubject<TaskDto[]> = new BehaviorSubject<TaskDto[]>([]);
  task$ = this.TaskSubject.asObservable();
  public TaskUserName: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  taskUserName$ = this.TaskUserName.asObservable()

  constructor(private http: HttpClient) {}

    createTask(task: TaskDto): Observable<TaskDto> {
      return this.http.post<TaskDto>(`${this.taskUrl}/create`, task).pipe(
        tap((response) => {
          this.TaskSubject.next([...this.TaskSubject.getValue(), response]);
        })
      );
    }

    updateTask(task: TaskDto): Observable<TaskDto> {
        return this.http.put<TaskDto>(`${this.taskUrl}/update/${task.taskId}`, task).pipe(
            tap((updatedTask) => {
                const tasks = this.TaskSubject.getValue();
                const index = tasks.findIndex(task => task.taskId === updatedTask.taskId);
                if (index !== -1) {
                  const updatedTasks = tasks.slice();
                    updatedTasks[index] = updatedTask;
                    this.TaskSubject.next(updatedTasks);
                }
            })
        );
    }

    updateTaskDragAndDrop(task: TaskDto): Observable<TaskDto> {
      return this.http.put<TaskDto>(`${this.taskUrl}/update/${task.taskId}`, task).pipe(
        tap((updatedTask) => {
          const tasks = this.TaskSubject.getValue();
          const taskIndex = tasks.findIndex(t => t.taskId === updatedTask.taskId);
          if (taskIndex > -1) {
            tasks[taskIndex] = updatedTask;
          }
          this.TaskSubject.next(tasks);
        })
      );
    }

    getTasksByBoardlistId(boardlistId: number): Observable<{ [boardlistId: number]: TaskDto[] }> {
      return this.http.get<TaskDto[]>(`${this.taskUrl}/boardlist/${boardlistId}`).pipe(
        map(tasks => tasks.reduce((acc, task) => {
          acc[task.boardlistId] = acc[task.boardlistId] ? [...acc[task.boardlistId], task] : [task];
          return acc;
        }, {} as { [boardlistId: number]: TaskDto[] }))
      );
    }

    getTasks(projectId: number): Observable<{ [boardlistId: number]: TaskDto[] }> {
      return this.http.get<TaskDto[]>(`${this.taskUrl}/project/${projectId}`).pipe(
        map(tasks => tasks.reduce((acc, task) => {
          acc[task.boardlistId] = acc[task.boardlistId] ? [...acc[task.boardlistId], task] : [task];
          return acc;
        }, {} as { [boardlistId: number]: TaskDto[] }))
      );
    }

    getUserNameByTask(taskId: number): Observable<string[]> {
      return this.http.get<string[]>(`${this.taskUrl}/taskUser/${taskId}`).pipe(
        tap(responseData => this.TaskUserName.next(responseData)),
      );
    }
}
