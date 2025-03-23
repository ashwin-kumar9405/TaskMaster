import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatBadgeModule
  ]
})
export class KanbanBoardComponent implements OnInit {
  todoTasks$!: Observable<Task[]>;
  inProgressTasks$!: Observable<Task[]>;
  completedTasks$!: Observable<Task[]>;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.todoTasks$ = this.taskService.getTasksByStatus('Todo');
    this.inProgressTasks$ = this.taskService.getTasksByStatus('InProgress');
    this.completedTasks$ = this.taskService.getTasksByStatus('Completed');
  }

  addNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  viewTask(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  editTask(event: Event, task: Task): void {
    event.stopPropagation();
    this.router.navigate(['/tasks', task.id, 'edit']);
  }

  deleteTask(event: Event, task: Task): void {
    event.stopPropagation();
    
    if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.taskService.deleteTask(task.id);
      this.snackBar.open('Task deleted successfully', 'Close', {
        duration: 3000
      });
    }
  }

  onTaskDrop(event: CdkDragDrop<Task[] | null>): void {
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }
    
    if (event.previousContainer === event.container) {
      // Task reordering within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Task moved to a different column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Update task status based on the new column
      const movedTask = event.container.data[event.currentIndex];
      let newStatus: TaskStatus;
      
      if (event.container.id === 'todo-list') {
        newStatus = 'Todo';
      } else if (event.container.id === 'in-progress-list') {
        newStatus = 'InProgress';
      } else {
        newStatus = 'Completed';
      }
      
      this.taskService.updateTaskStatus(movedTask.id, newStatus);
      this.snackBar.open(`Task moved to ${newStatus === 'InProgress' ? 'In Progress' : newStatus}`, 'Close', {
        duration: 2000
      });
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

  formatDueDate(date: Date | null): string {
    if (!date) return 'No due date';
    const dueDate = new Date(date);
    const today = new Date();
    
    // Reset time part for comparison
    today.setHours(0, 0, 0, 0);
    const dueDateNoTime = new Date(dueDate);
    dueDateNoTime.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((dueDateNoTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue (${dueDate.toLocaleDateString()})`;
    } else if (diffDays === 0) {
      return 'Due Today';
    } else if (diffDays === 1) {
      return 'Due Tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  }
}
