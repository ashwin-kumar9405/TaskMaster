import { Routes, provideRouter, withHashLocation } from '@angular/router';
import { ApplicationConfig } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/:id', component: TaskDetailComponent },
  { path: 'tasks/:id/edit', component: TaskFormComponent },
  { path: 'kanban', component: KanbanBoardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'dashboard' }
];

// Configuration for GitHub Pages
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation())
  ]
};
