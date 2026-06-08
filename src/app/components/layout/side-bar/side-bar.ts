import { Component, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  private themeService = inject(ThemeService);
  isCollapsed = signal(false);
  isDarkMode = this.themeService.isDarkMode;

  toggleSidebar() {
    this.isCollapsed.update(value => !value);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
