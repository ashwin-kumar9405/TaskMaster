import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task, TaskFilter, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // In-memory database
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private filterSubject = new BehaviorSubject<TaskFilter>({});

  constructor() {
    // Initialize with some example tasks
    this.initializeTasks();
  }

  private initializeTasks(): void {
    // No mock data as per guidelines
    this.updateTasks();
  }

  private updateTasks(): void {
    this.tasksSubject.next([...this.tasks]);
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  getFilteredTasks(): Observable<Task[]> {
    return this.tasksSubject.pipe(
      map(tasks => this.applyFilter(tasks, this.filterSubject.getValue()))
    );
  }

  private applyFilter(tasks: Task[], filter: TaskFilter): Task[] {
    return tasks.filter(task => {
      // Apply status filter
      if (filter.status && task.status !== filter.status) {
        return false;
      }
      
      // Apply priority filter
      if (filter.priority && task.priority !== filter.priority) {
        return false;
      }
      
      // Apply category filter
      if (filter.category && task.category !== filter.category) {
        return false;
      }
      
      // Apply text search filter
      if (filter.searchText) {
        const searchText = filter.searchText.toLowerCase();
        return task.title.toLowerCase().includes(searchText) || 
               task.description.toLowerCase().includes(searchText);
      }
      
      return true;
    });
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasksSubject.pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }

  getTask(id: string): Observable<Task | undefined> {
    return this.tasksSubject.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: null
    };
    
    this.tasks.push(newTask);
    this.updateTasks();
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    
    if (index !== -1) {
      this.tasks[index] = {
        ...updatedTask,
        updatedAt: new Date()
      };
      
      this.updateTasks();
    }
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
    const index = this.tasks.findIndex(task => task.id === taskId);
    
    if (index !== -1) {
      this.tasks[index] = {
        ...this.tasks[index],
        status: newStatus,
        updatedAt: new Date()
      };
      
      this.updateTasks();
    }
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.updateTasks();
  }

  setFilter(filter: TaskFilter): void {
    this.filterSubject.next(filter);
  }

  getFilter(): Observable<TaskFilter> {
    return this.filterSubject.asObservable();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}
