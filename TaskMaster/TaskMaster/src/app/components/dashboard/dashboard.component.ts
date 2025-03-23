import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface StatusCount {
  status: TaskStatus;
  count: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class DashboardComponent implements OnInit {
  todoTasks$!: Observable<Task[]>;
  inProgressTasks$!: Observable<Task[]>;
  completedTasks$!: Observable<Task[]>;
  tasksByStatus$!: Observable<StatusCount[]>;

  statusColors = {
    Todo: '#ff9800',
    InProgress: '#2196f3',
    Completed: '#4caf50'
  };

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.todoTasks$ = this.taskService.getTasksByStatus('Todo');
    this.inProgressTasks$ = this.taskService.getTasksByStatus('InProgress');
    this.completedTasks$ = this.taskService.getTasksByStatus('Completed');

    this.tasksByStatus$ = this.taskService.getTasks().pipe(
      map(tasks => {
        const todoCount = tasks.filter(t => t.status === 'Todo').length;
        const inProgressCount = tasks.filter(t => t.status === 'InProgress').length;
        const completedCount = tasks.filter(t => t.status === 'Completed').length;

        return [
          { status: 'Todo' as TaskStatus, count: todoCount, color: this.statusColors.Todo },
          { status: 'InProgress' as TaskStatus, count: inProgressCount, color: this.statusColors.InProgress },
          { status: 'Completed' as TaskStatus, count: completedCount, color: this.statusColors.Completed }
        ];
      })
    );
  }

  navigateToTasks(status?: TaskStatus): void {
    if (status) {
      this.taskService.setFilter({ status });
      this.router.navigate(['/tasks']);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  navigateToKanban(): void {
    this.router.navigate(['/kanban']);
  }

  addNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }
}
