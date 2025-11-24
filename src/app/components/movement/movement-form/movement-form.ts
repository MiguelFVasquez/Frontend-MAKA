import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NewMovementDTO } from '../../../models/Movement/NewMovementDTO';
import { ProductResponse } from '../../../models/Product/ProductResponse';
import { AlertService } from '../../../services/alert-service';
import { MovementService } from '../../../services/movement-service';
import { Product } from '../../../services/product';

@Component({
  selector: 'app-movement-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.css',
})
export class MovementForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(Product);
  private movementService = inject(MovementService);
  private alertService = inject(AlertService);

  movementType: 'IN' | 'OUT' = 'IN';
  typeLabel = 'Registrar Movimiento';
  products: ProductResponse[] = [];
  selectedProduct: ProductResponse | null = null;
  isLoading = false;

  form = this.fb.group({
    productId: [null as number | null, [Validators.required]],
    amount: [1, [Validators.required, Validators.min(1)]],
    notes: ['']
  });

  ngOnInit() {
    // Determinar tipo de movimiento por la ruta
    const url = this.router.url;
    this.movementType = url.includes('in') ? 'IN' : 'OUT';
    this.typeLabel = this.movementType === 'IN' 
      ? 'Registrar Entrada' 
      : 'Registrar Salida';

    this.loadProducts();

    // Escuchar cambios en el producto seleccionado
    this.form.get('productId')?.valueChanges.subscribe(productId => {
      this.selectedProduct = this.products.find(p => p.id === productId) || null;
    });
  }

  private loadProducts() {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.alertService.error('Error', 'No se pudieron cargar los productos');
        this.isLoading = false;
      }
    });
  }

  calculateNewStock(): number {
    if (!this.selectedProduct || !this.form.value.amount) {
      return this.selectedProduct?.stock || 0;
    }

    const amount = Number(this.form.value.amount);
    return this.movementType === 'IN'
      ? this.selectedProduct.stock + amount
      : this.selectedProduct.stock - amount;
  }

  submit() {
    if (this.form.invalid) {
      this.markAllFieldsAsTouched();
      this.alertService.warning('Formulario incompleto', 'Completa todos los campos requeridos');
      return;
    }

    this.isLoading = true;

    const dto: NewMovementDTO = {
      productId: this.form.value.productId!,
      moveType: this.movementType,
      amount: this.form.value.amount!,
    };

    this.movementService.create(dto).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.success(
          'Movimiento registrado', 
          `Movimiento de ${this.movementType === 'IN' ? 'entrada' : 'salida'} registrado exitosamente`
        );
        this.router.navigate(['/movements']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creando movimiento:', error);
        this.alertService.error(
          'Error al registrar movimiento', 
          error.message || 'Ha ocurrido un error inesperado'
        );
      }
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  cancel() {
    this.router.navigate(['/movements']);
  }
}