import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalComponent: any = null;

  // Método para registrar el componente modal
  registerModal(modalComponent: any) {
    this.modalComponent = modalComponent;
  }

  async confirm(
    title: string, 
    message: string, 
    confirmText?: string, 
    cancelText?: string
  ): Promise<boolean> {
    if (!this.modalComponent) {
      console.error('Modal component not registered');
      return false;
    }
    
    return await this.modalComponent.open(title, message, confirmText, cancelText);
  }
}