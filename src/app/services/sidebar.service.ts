import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isCollapsed = signal(false);
  private _isMobileOpen = signal(false);

  isCollapsed = this._isCollapsed.asReadonly();
  isMobileOpen = this._isMobileOpen.asReadonly();

  toggleSidebar() {
    this._isCollapsed.update(v => !v);
  }

  toggleMobileMenu() {
    this._isMobileOpen.update(v => !v);
  }

  closeMobileMenu() {
    this._isMobileOpen.set(false);
  }
}
