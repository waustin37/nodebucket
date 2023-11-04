/**
 * Title: tasks.component.ts
 * Author: William Austin
 * Date: 03 November 2023
 * Description: Tasks Component for Nodebucket
 */
import { Component, OnDestroy } from '@angular/core';
import { SignOutService } from '../sign-out.service';
import { SignInService } from '../sign-in.service';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../tasks.service';
import { TasksDialogComponent } from '../tasks-dialog/tasks-dialog.component';
import { CookieService } from 'ngx-cookie-service';

interface Task {
  description: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnDestroy {
  employeeId: string;
  firstName: string;

  constructor(
    private signOutService: SignOutService, 
    private signInService: SignInService,
    public dialog: MatDialog, 
    private tasksService: TasksService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  async fetchTasks() {
    this.employeeId = this.cookieService.get('session_user'); // Use the 'session_user' cookie
    this.tasksService.setEmployeeId(this.employeeId);

    if (this.signInService.employee) {
      this.firstName = this.signInService.employee.firstName;
  
      // Fetch tasks using employee ID
      const res = await fetch(`http://localhost:3000/api/employees/${this.employeeId}/todoTasks`);
      const data = await res.json();
  
      const todoTasks: Task[] = data.todoTasks;
  
      console.log(data);
      console.log(todoTasks);
      console.log(this.firstName);
  
      if (Array.isArray(todoTasks)) {
        this.tasksService.setTasks(todoTasks);
      }
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(TasksDialogComponent, {
      disableClose: true,
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.addTask(result);
      }
    });
  }

  get toDoTasks(): Task[] {
    return this.tasksService.getToDoTasks();
  }

  ngOnDestroy() {
    // Call the sign-out method when leaving the "tasks" page
    this.signOutService.signOut();
    console.log('User signed out'); // Add console log here
  }
}
