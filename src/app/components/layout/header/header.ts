import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private sidebarService = inject(SidebarService);

  toggleMobileMenu() {
    this.sidebarService.toggleMobileMenu();
  }
}
