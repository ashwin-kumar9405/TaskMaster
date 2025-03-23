import { Component, OnInit } from '@angular/core';
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule
  ]
})
export class SettingsComponent implements OnInit {
  currentTheme$!: Observable<ThemeMode>;

  constructor(
    private themeService: ThemeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentTheme$ = this.themeService.getTheme();
  }

  setTheme(theme: ThemeMode): void {
    this.themeService.setTheme(theme);
    this.snackBar.open(`Theme changed to ${theme} mode`, 'Close', {
      duration: 3000
    });
  }
}
