export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskCategory = 'Work' | 'Personal' | 'Urgent' | 'Other';
export type TaskStatus = 'Todo' | 'InProgress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface TaskFilter {
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  category?: TaskCategory | '';
  searchText?: string;
}
