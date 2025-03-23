import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ]
})
export class NavigationComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  isDarkTheme = false;
  private _mobileQueryListener: () => void;
  private themeSubscription: Subscription = new Subscription();

  menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/tasks', icon: 'assignment', label: 'Tasks' },
    { path: '/kanban', icon: 'view_column', label: 'Kanban Board' },
    { path: '/settings', icon: 'settings', label: 'Settings' }
  ];

  constructor(
    private router: Router,
    private media: MediaMatcher,
    private themeService: ThemeService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => {};
  }

  ngOnInit(): void {
    this._mobileQueryListener = () => {};
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.themeSubscription = this.themeService.getTheme().subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.themeSubscription.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isActive(path: string): boolean {
    return this.router.isActive(path, false);
  }
}
