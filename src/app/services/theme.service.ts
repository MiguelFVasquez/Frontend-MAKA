import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'maka-theme';
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const mode = this.isDarkMode();
      this.applyTheme(mode);
      localStorage.setItem(this.THEME_KEY, mode ? 'dark' : 'light');
    });
  }

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
