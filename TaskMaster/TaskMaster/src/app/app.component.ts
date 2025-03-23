import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent]
})
export class AppComponent implements OnInit {
  title = 'Task Management App';
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.getTheme().subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }
}
