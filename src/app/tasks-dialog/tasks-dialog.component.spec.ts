import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDialogComponent } from './tasks-dialog.component';

describe('TasksDialogComponent', () => {
  let component: TasksDialogComponent;
  let fixture: ComponentFixture<TasksDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TasksDialogComponent]
    });
    fixture = TestBed.createComponent(TasksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
