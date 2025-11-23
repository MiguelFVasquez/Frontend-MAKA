import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './components/shared/alert/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend-Maka');
}
