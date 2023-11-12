/**
 * Title: tasks-dialog.component
 * Author: William Austin
 * Date: 01 November 2023
 * Description: Dialog Box for Adding a new task to NodeBucket
 */

import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-tasks-dialog',
  templateUrl: './tasks-dialog.component.html',
  styleUrls: ['./tasks-dialog.component.css']
})
export class TasksDialogComponent {
  newTask: string = '';
  showError: boolean = false;
  employeeId: string = '';

  constructor(
    private tasksService: TasksService,
    private cookieService: CookieService,
    private dialogRef: MatDialogRef<TasksDialogComponent>
  ) {}

  submitTask() {
    if (this.newTask.trim() !== '') {
      this.employeeId = this.cookieService.get('session_user');
      console.log(this.employeeId);
       // Set the employeeId from the service
      if (this.employeeId) {
        this.tasksService.addTask(this.employeeId, this.newTask).subscribe(
          () => {
            this.dialogRef.close(); 
            this.tasksService.fetchTasks(this.employeeId);
            console.log('Task Added Successfully');
          },
          error => {
            console.error('Error adding task:', error); // Log the error
          }
        );
      } else {
        console.error('No employeeId found.'); // Log error if employeeId is not set
      }
    } else {
      this.showError = true;
    }
  }
}
