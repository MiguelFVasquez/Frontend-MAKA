import { Injectable, signal } from '@angular/core';
import { Alert, AlertOptions } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alerts = signal<Alert[]>([]);
  private nextId = 0;

  // Exponemos la signal para que los componentes puedan leerla
  readonly alertsList = this.alerts.asReadonly();

  // Método principal para mostrar alertas
  show(alert: Alert & AlertOptions) {
    const id = this.nextId++;
    const newAlert: Alert = {
      ...alert,
      id,
      duration: alert.duration || 5000,
      autoClose: alert.autoClose ?? true
    };

    // Agregar la alerta
    this.alerts.update(alerts => [...alerts, newAlert]);

    // Auto-eliminar si está configurado
    if (newAlert.autoClose) {
      setTimeout(() => {
        this.remove(id);
      }, newAlert.duration);
    }

    return id; // Retornar ID por si quieres cerrarla manualmente
  }

  // Métodos helpers para tipos específicos
  success(title: string, message: string = '', options?: AlertOptions) {
    return this.show({ type: 'success', title, message, ...options });
  }

  error(title: string, message: string = '', options?: AlertOptions) {
    return this.show({ type: 'error', title, message, ...options });
  }

  warning(title: string, message: string = '', options?: AlertOptions) {
    return this.show({ type: 'warning', title, message, ...options });
  }

  info(title: string, message: string = '', options?: AlertOptions) {
    return this.show({ type: 'info', title, message, ...options });
  }

  // Remover alerta por ID
  remove(id: number) {
    this.alerts.update(alerts => alerts.filter(alert => alert.id !== id));
  }

  // Limpiar todas las alertas
  clear() {
    this.alerts.set([]);
  }
}