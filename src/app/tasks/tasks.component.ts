/**
 * Title: tasks.component.ts
 * Author: William Austin
 * Date: 03 November 2023
 * Description: Tasks Component for Nodebucket
 */
import { Component, OnDestroy } from '@angular/core';
import { SignOutService } from '../sign-out.service';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../tasks.service';
import { TasksDialogComponent } from '../tasks-dialog/tasks-dialog.component';
import { CookieService } from 'ngx-cookie-service';

interface Task {
  taskId: string;
  description: string;
  isCompletedTask?: boolean;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnDestroy {
  employeeId: string;
  firstName: string;
  tasks: Task[] = [];
  doneTasks: Task[] = [];
  currentItem: any;

  constructor(
    private signOutService: SignOutService, 
    public dialog: MatDialog, 
    private tasksService: TasksService,
    private cookieService: CookieService,

  ) {}

  //What happens when we open the tasks page. We get the Employee Id from the Cookie, 
  //and we populate the todo list
  ngOnInit(): void {
    this.tasksService.todoTasks$.subscribe(todoTasks => {
      this.tasks = todoTasks;
    });

    this.tasksService.doneTasks$.subscribe(doneTasks => {
      this.doneTasks = doneTasks;
    });
    this.employeeId = this.cookieService.get('session_user');
    this.tasksService.fetchTasks(this.employeeId);
    this.firstName = this.cookieService.get('name');
  }
  

  deleteTask(taskId: string, isCompletedTask: boolean = false): void {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      this.tasksService.deleteTask(this.employeeId, taskId, isCompletedTask).subscribe(
        (response) => {
          console.log(response);
          this.tasksService.fetchTasks(this.employeeId); 
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  
  //Once we hit "add task" it will open the Dialog Box for the user to add Tasks
  openDialog(): void {
    const dialogRef = this.dialog.open(TasksDialogComponent, {
      disableClose: true,
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
          this.tasksService.fetchTasks(this.employeeId); // Refresh the task list after addition
          console.log('Task List Refreshed')
        } (error) => {
            console.error(error);
        }
    });
  }

  private draggedTask: Task | null = null;
  //Drag and Drop Functionality 
  onDragStart(task: any) {
    console.log('onDragStart');
    this.draggedTask = task;
  }  

  onDrop(event: any, targetStatus: string) {
    event.preventDefault();
    console.log('onDragDrop');

    if (this.draggedTask) {
      // Check if the drop target is the same as the source
      if (targetStatus === 'todo' && !this.draggedTask.isCompletedTask) {
        // If the target is "To-Do" and the source was also "To-Do", re-order the tasks
        const index = this.tasks.indexOf(this.draggedTask);
        this.tasks.splice(index, 1); // Remove the task from the source
        const dropIndex = this.getDropIndex(event);
        this.tasks.splice(dropIndex, 0, this.draggedTask); // Insert the task at the new position
      } else if (targetStatus === 'completed' && this.draggedTask.isCompletedTask) {
        // If the target is "Completed" and the source was also "Completed", re-order the tasks
        const index = this.doneTasks.indexOf(this.draggedTask);
        this.doneTasks.splice(index, 1); // Remove the task from the source
        const dropIndex = this.getDropIndex(event);
        this.doneTasks.splice(dropIndex, 0, this.draggedTask); // Insert the task at the new position
      } else {
        // If the target status is different, perform the existing moveTaskToCompleted logic
        const record = targetStatus === 'completed' ? this.doneTasks : this.tasks;
        this.tasksService.moveTaskToCompleted(this.employeeId, this.draggedTask.taskId).subscribe(
          (response) => {
            console.log(response);
            // Refresh the task lists after moving the task
            this.tasksService.fetchTasks(this.employeeId);
          },
          (error) => {
            console.error(error);
          }
        );
      }

      this.draggedTask = null; // Reset draggedTask
    }
  }

  onDragOver(event: any){
    console.log('onDragOver')
    event.preventDefault();
  }

// Helper function to determine the drop index based on mouse position
private getDropIndex(event: any): number {
  const rect = event.currentTarget.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  const itemHeight = 40;
  return Math.floor(mouseY / itemHeight);
}

  //Automatic Sign Out
  ngOnDestroy() {
    this.signOutService.signOut();
    console.log('User signed out');
  }
}
