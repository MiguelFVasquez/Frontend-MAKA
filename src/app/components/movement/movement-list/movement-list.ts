import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MovementResponse } from '../../../models/Movement/MovementRespone';
import { AlertService } from '../../../services/alert-service';
import { MovementService } from '../../../services/movement-service';


@Component({
  selector: 'app-movement-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './movement-list.html',
  styleUrl: './movement-list.css',
})
export class MovementList implements OnInit { 
  private movementService = inject(MovementService);
  private alertService = inject(AlertService);

  movements: MovementResponse[] = [];
  filteredMovements: any[] = []; // Para datos transformados
  
  // Filtros
  typeFilter = new FormControl('');
  dateFilter = new FormControl('');
  
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadMovements();
    this.setupFilters();
  }

  /**
   * Carga los movimientos desde el backend
   */
  loadMovements() {
    this.isLoading = true;
    this.errorMessage = '';

    this.movementService.getAll().subscribe({
      next: (movements) => {
        this.movements = movements;
        this.filteredMovements = this.transformMovementsForList(movements);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando movimientos:', error);
        this.errorMessage = 'Error al cargar los movimientos. Por favor, intenta nuevamente.';
        this.isLoading = false;
        this.alertService.error('Error', 'No se pudieron cargar los movimientos');
      }
    });
  }

  /**
   * Transforma los movimientos para la lista
   */
  private transformMovementsForList(movements: MovementResponse[]): any[] {
    return movements.map(movement => ({
      id: movement.id,
      productName: movement.product.name,
      typeMove: movement.typeMove.move, // Extraer "IN" o "OUT"
      amount: movement.amount,
      date_mxove: movement.date_move, // Mapear date_move a date_mxove
      user: 'Sistema' // Por defecto
    }));
  }

  /**
   * Configura los observables de los filtros
   */
  setupFilters() {
    // Filtro de tipo
    this.typeFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    // Filtro de fecha
    this.dateFilter.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  /**
   * Aplica los filtros a la lista de movimientos
   */
  applyFilters() {
    let filtered = this.transformMovementsForList(this.movements);

    // Filtro por tipo
    const typeValue = this.typeFilter.value;
    if (typeValue) {
      filtered = filtered.filter(m => m.typeMove === typeValue);
    }

    // Filtro por fecha
    const dateValue = this.dateFilter.value;
    if (dateValue) {
      filtered = filtered.filter(m => {
        const movementDate = new Date(m.date_mxove).toISOString().split('T')[0];
        return movementDate === dateValue;
      });
    }

    this.filteredMovements = filtered;
  }

  /**
   * Obtiene el mensaje cuando no hay movimientos
   */
  getEmptyMessage(): string {
    if (this.typeFilter.value || this.dateFilter.value) {
      return 'No hay movimientos que coincidan con los filtros aplicados';
    }
    return 'No hay movimientos registrados';
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters() {
    this.typeFilter.setValue('');
    this.dateFilter.setValue('');
  }

  /**
   * Cuenta movimientos por tipo
   */
  countMovementsByType(type: 'IN' | 'OUT'): number {
    return this.movements.filter(m => m.typeMove.move === type).length;
  }
}