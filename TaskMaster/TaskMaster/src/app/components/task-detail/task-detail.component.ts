import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule
  ]
})
export class TaskDetailComponent implements OnInit {
  task: Task | undefined;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    
    if (taskId) {
      this.taskService.getTask(taskId).subscribe(
        task => {
          this.task = task;
          this.loading = false;
        },
        error => {
          console.error('Error fetching task:', error);
          this.error = true;
          this.loading = false;
          this.snackBar.open('Error loading task details', 'Close', {
            duration: 5000
          });
        }
      );
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }

  deleteTask(): void {
    if (this.task && confirm(`Are you sure you want to delete the task "${this.task.title}"?`)) {
      this.taskService.deleteTask(this.task.id);
      this.snackBar.open('Task deleted successfully', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/tasks']);
    }
  }

  backToList(): void {
    this.router.navigate(['/tasks']);
  }

  formatDate(date: Date | null): string {
    if (!date) return 'No date set';
    return new Date(date).toLocaleDateString();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Todo': return 'status-todo';
      case 'InProgress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }
}
