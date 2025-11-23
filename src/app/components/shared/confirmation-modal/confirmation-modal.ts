import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal-service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css'
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  title = '';
  message = '';
  confirmText = 'Confirmar';
  cancelText = 'Cancelar';
  private resolveFn: ((result: boolean) => void) | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    // Registrar este componente en el servicio
    this.modalService.registerModal(this);
  }

  ngOnDestroy() {
    // Limpiar registro al destruir el componente
    this.modalService.registerModal(null);
  }

  open(title: string, message: string, confirmText?: string, cancelText?: string): Promise<boolean> {
    this.title = title;
    this.message = message;
    this.confirmText = confirmText || 'Confirmar';
    this.cancelText = cancelText || 'Cancelar';
    this.isOpen = true;

    return new Promise((resolve) => {
      this.resolveFn = resolve;
    });
  }

  confirm() {
    this.isOpen = false;
    if (this.resolveFn) {
      this.resolveFn(true);
      this.resolveFn = null;
    }
  }

  cancel() {
    this.isOpen = false;
    if (this.resolveFn) {
      this.resolveFn(false);
      this.resolveFn = null;
    }
  }
}