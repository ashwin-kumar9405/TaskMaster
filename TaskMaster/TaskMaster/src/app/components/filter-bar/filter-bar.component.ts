import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskFilter, TaskCategory, TaskPriority, TaskStatus } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatInputModule,
    MatSelectModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ]
})
export class FilterBarComponent implements OnInit {
  @Input() currentFilter: TaskFilter = {};
  @Output() filterChange = new EventEmitter<TaskFilter>();

  searchText: string = '';
  selectedStatus: TaskStatus | '' = '';
  selectedPriority: TaskPriority | '' = '';
  selectedCategory: TaskCategory | '' = '';

  statuses: (TaskStatus | '')[] = ['', 'Todo', 'InProgress', 'Completed'];
  priorities: (TaskPriority | '')[] = ['', 'Low', 'Medium', 'High'];
  categories: (TaskCategory | '')[] = ['', 'Work', 'Personal', 'Urgent', 'Other'];

  ngOnInit(): void {
    // Initialize form values from input
    this.searchText = this.currentFilter.searchText || '';
    this.selectedStatus = this.currentFilter.status || '';
    this.selectedPriority = this.currentFilter.priority || '';
    this.selectedCategory = this.currentFilter.category || '';
  }

  applyFilter(): void {
    const filter: TaskFilter = {
      searchText: this.searchText || undefined,
      status: this.selectedStatus || undefined,
      priority: this.selectedPriority || undefined,
      category: this.selectedCategory || undefined
    };

    this.filterChange.emit(filter);
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.selectedCategory = '';
    
    this.filterChange.emit({});
  }

  isFiltersApplied(): boolean {
    return !!(this.searchText || this.selectedStatus || this.selectedPriority || this.selectedCategory);
  }
}
