import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'task-manager-theme';
  private themeSubject = new BehaviorSubject<ThemeMode>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as ThemeMode | null;
    if (savedTheme) {
      this.themeSubject.next(savedTheme);
      this.applyTheme(savedTheme);
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme: ThemeMode = prefersDark ? 'dark' : 'light';
      this.themeSubject.next(defaultTheme);
      this.applyTheme(defaultTheme);
    }
  }

  getTheme(): Observable<ThemeMode> {
    return this.themeSubject.asObservable();
  }

  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.THEME_STORAGE_KEY, theme);
  }

  toggleTheme(): void {
    const currentTheme = this.themeSubject.getValue();
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: ThemeMode): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }
}
