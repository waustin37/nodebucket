/**
 * Title: tasks-dialog.component
 * Author: William Austin
 * Date: 01 November 2023
 * Description: Dialog Box for Adding a new task to NodeBucket
 */

import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tasks-dialog',
  templateUrl: './tasks-dialog.component.html',
  styleUrls: ['./tasks-dialog.component.css']
})
export class TasksDialogComponent {
  newTask: string = '';
  showError: boolean = false;

  constructor(
    private tasksService: TasksService,
    private dialogRef: MatDialogRef<TasksDialogComponent>,
    private http: HttpClient // Inject HttpClient
  ) {}

  submitTask() {
    if (this.newTask.trim() !== '') {
      this.http.post(`http://localhost:3000/api/employees/${this.tasksService.employeeId}/todoTasks`, {
        description: this.newTask // Pass the description as the body
      }).subscribe(
        response => {
          this.tasksService.addTask(this.newTask); // If the API call is successful, add the task
          this.dialogRef.close(); // Close the dialog
        },
        error => {
          console.log(error); // Log the error
        }
      );
    } else {
      this.showError = true;
    }
  }
}
