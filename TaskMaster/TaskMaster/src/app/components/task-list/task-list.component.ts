import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, combineLatest } from 'rxjs';
import { Task, TaskFilter } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    FilterBarComponent
  ]
})
export class TaskListComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Task>([]);
  displayedColumns: string[] = ['title', 'dueDate', 'priority', 'category', 'status', 'actions'];
  currentFilter: TaskFilter = {};
  private subscriptions: Subscription = new Subscription();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const tasksSubscription = this.taskService.getTasks().subscribe(tasks => {
      this.dataSource.data = tasks;
    });
    
    const filterSubscription = this.taskService.getFilter().subscribe(filter => {
      this.currentFilter = filter;
      this.applyFilter();
    });
    
    this.subscriptions.add(tasksSubscription);
    this.subscriptions.add(filterSubscription);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilter(): void {
    this.dataSource.filterPredicate = (data: Task, _: string) => {
      // Status filter
      if (this.currentFilter.status && data.status !== this.currentFilter.status) {
        return false;
      }
      
      // Priority filter
      if (this.currentFilter.priority && data.priority !== this.currentFilter.priority) {
        return false;
      }
      
      // Category filter
      if (this.currentFilter.category && data.category !== this.currentFilter.category) {
        return false;
      }
      
      // Text search
      if (this.currentFilter.searchText) {
        const searchText = this.currentFilter.searchText.toLowerCase();
        return data.title.toLowerCase().includes(searchText) || 
               data.description.toLowerCase().includes(searchText);
      }
      
      return true;
    };
    
    // Trigger filter
    this.dataSource.filter = 'triggered';
  }

  onFilterChange(filter: TaskFilter): void {
    this.taskService.setFilter(filter);
  }

  createTask(): void {
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

  formatDate(date: Date | null): string {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString();
  }
}
