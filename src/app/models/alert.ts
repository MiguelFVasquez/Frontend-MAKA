export interface Alert {
  id?: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // Duración en milisegundos (opcional)
  autoClose?: boolean; // Si se cierra automáticamente
}

export interface AlertOptions {
  duration?: number;
  autoClose?: boolean;
}