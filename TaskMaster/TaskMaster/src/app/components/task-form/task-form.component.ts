import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task, TaskStatus, TaskPriority, TaskCategory } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  loading = false;
  submitting = false;

  statuses: TaskStatus[] = ['Todo', 'InProgress', 'Completed'];
  priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  categories: TaskCategory[] = ['Work', 'Personal', 'Urgent', 'Other'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;
    
    if (this.isEditMode && this.taskId) {
      this.loading = true;
      this.loadTaskData(this.taskId);
    }
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      dueDate: [null],
      priority: ['Medium', Validators.required],
      category: ['Work', Validators.required],
      status: ['Todo', Validators.required]
    });
  }

  private loadTaskData(taskId: string): void {
    this.taskService.getTask(taskId).subscribe(
      task => {
        if (task) {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            category: task.category,
            status: task.status
          });
        } else {
          this.snackBar.open('Task not found', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        }
        this.loading = false;
      },
      error => {
        console.error('Error loading task:', error);
        this.snackBar.open('Error loading task data', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/tasks']);
      }
    );
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.submitting = true;
    const formData = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      // Update existing task
      this.taskService.getTask(this.taskId).subscribe(
        existingTask => {
          if (existingTask) {
            const updatedTask: Task = {
              ...existingTask,
              title: formData.title,
              description: formData.description,
              dueDate: formData.dueDate,
              priority: formData.priority,
              category: formData.category,
              status: formData.status
            };
            
            this.taskService.updateTask(updatedTask);
            this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/tasks', this.taskId]);
          }
          this.submitting = false;
        },
        error => {
          console.error('Error updating task:', error);
          this.snackBar.open('Error updating task', 'Close', { duration: 3000 });
          this.submitting = false;
        }
      );
    } else {
      // Create new task
      this.taskService.addTask({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        category: formData.category,
        status: formData.status
      });
      
      this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
      this.router.navigate(['/tasks']);
      this.submitting = false;
    }
  }

  cancel(): void {
    if (this.isEditMode && this.taskId) {
      this.router.navigate(['/tasks', this.taskId]);
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
