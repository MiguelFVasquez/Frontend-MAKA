import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './components/shared/alert/alert';
import { ConfirmationModalComponent } from './components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertComponent,ConfirmationModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend-Maka');
}
