/**
 * Title: tasks.service.ts
 * Author: William Austin
 * Date: 03 November 2023
 * Description: Tasks Service for NodeBucket
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface Task {
  taskId: string;
  description: string;
  isCompletedTask?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class TasksService {
  employeeId: string;
  todoTasksSubject = new BehaviorSubject<Task[]>([]);
  doneTasksSubject = new BehaviorSubject<Task[]>([]);
  todoTasks$ = this.todoTasksSubject.asObservable();
  doneTasks$ = this.doneTasksSubject.asObservable();

  constructor(private http: HttpClient) {}


// Sets employee ID to a string
  setEmployeeId(id: string): void {
    this.employeeId = id;
  }

// Gets employee ID
  getEmployeeId(): string {
    return this.employeeId;
  }

//Fetch Tasks
  fetchTasks(employeeId: string): void {
    this.http.get<any>(`/api/employees/${employeeId}/todoTasks`)
      .subscribe(data => {
        const todoTasks: Task[] = data.todoTasks;
        const doneTasks: Task[] = data.doneTasks;
        this.todoTasksSubject.next(todoTasks);
        this.doneTasksSubject.next(doneTasks);
      }, error => {
        console.error('Error fetching tasks: ', error);
      });
  }

  addTask(employeeId: string, taskDescription: string): Observable<any> {
    return this.http.post<any>(`/api/employees/${employeeId}/todoTasks`, { description: taskDescription });
  }

  deleteTask(employeeId: string, taskId: string, isCompletedTask: boolean = false): Observable<any> {
    const endpoint = isCompletedTask ? 'doneTasks' : 'todoTasks';
    return this.http.delete<any>(`/api/employees/${employeeId}/${endpoint}/${taskId}`);
  }

  //How the tasks move from To-Do to Completed
  moveTaskToCompleted(employeeId: string, taskId: string): Observable<any> {
    return this.http.put<any>(`/api/employees/${employeeId}/todoTasks/${taskId}`, {});
  }


}

