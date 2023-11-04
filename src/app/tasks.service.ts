/**
 * Title: tasks.service.ts
 * Author: William Austin
 * Date: 03 November 2023
 * Description: Tasks Service for NodeBucket
 */

import { Injectable } from '@angular/core';

interface Task {
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  toDoTasks: Task[] = [];
  employeeId: string = '';

  constructor() {}

  setTasks(tasks: Task[]) {
    this.toDoTasks = tasks;
  }

  addTask(taskDescription: string) {
    const newTask: Task = { description: taskDescription };
    this.toDoTasks.push(newTask);
  }

  getToDoTasks(): Task[] {
    return this.toDoTasks;
  }

  setEmployeeId(employeeId: string) {
    this.employeeId = employeeId; // Set the employeeId
  }
}

