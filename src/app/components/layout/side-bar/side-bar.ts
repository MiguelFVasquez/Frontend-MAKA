import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  private themeService = inject(ThemeService);
  private sidebarService = inject(SidebarService);
  
  isCollapsed = this.sidebarService.isCollapsed;
  isMobileOpen = this.sidebarService.isMobileOpen;
  isDarkMode = this.themeService.isDarkMode;

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  closeMobileMenu() {
    this.sidebarService.closeMobileMenu();
  }
}
