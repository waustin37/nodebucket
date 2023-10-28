import { Component, OnDestroy } from '@angular/core';
import { SignOutService } from '../sign-out.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnDestroy {
  constructor(private signOutService: SignOutService) {}

  ngOnDestroy() {
    // Call the sign-out method when leaving the "tasks" page
    this.signOutService.signOut();
    console.log('User signed out'); // Add console log here
  }
}
