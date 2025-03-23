import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskFilter } from '../models/task.model';

@Pipe({
  name: 'filterTasks',
  pure: false,
  standalone: true
})
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[], filter: TaskFilter): Task[] {
    if (!tasks || !filter) {
      return tasks;
    }

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
}
