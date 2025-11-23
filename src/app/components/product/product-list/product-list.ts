import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductResponse } from '../../../models/Product/ProductResponse';
import { Product } from '../../../services/product';
import { AlertService } from '../../../services/alert-service';
import { ModalService } from '../../../services/modal-service';


@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})


export class ProductList implements OnInit {

  private productService = inject(Product);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);


  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];
  
  searchControl = new FormControl('');
  statusFilter = new FormControl('');
  
  isLoading = false;
  errorMessage = '';
  deletingProductId: number | null = null;

  ngOnInit() {
    this.loadProducts();
    this.setupFilters();
  }

  /**
   * Carga los productos desde el backend
   */
  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.errorMessage = 'Error al cargar los productos. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Configura los observables de los filtros
   */
  setupFilters() {
    // Filtro de búsqueda con debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });

    // Filtro de estado
    this.statusFilter.valueChanges.subscribe((status) => {
      if (status) {
        this.loadProductsByStatus(status as 'ACTIVO' | 'INACTIVO' | 'REPOSICION');
      } else {
        this.loadProducts();
      }
    });
  }

  /**
   * Carga productos filtrados por estado desde el backend
   */
  loadProductsByStatus(status: 'ACTIVO' | 'INACTIVO' | 'REPOSICION') {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getByStatus(status).subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando productos por estado:', error);
        this.errorMessage = 'Error al filtrar productos. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica los filtros de búsqueda
   */
  applyFilters() {
    const searchTerm = this.searchControl.value || '';
    this.filteredProducts = this.productService.searchProducts(this.products, searchTerm);
  }
  async deleteProduct(product: ProductResponse) {
    const confirmed = await this.modalService.confirm(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    );

    if (!confirmed) return;

    this.deletingProductId = product.id;
    this.productService.deleteProduct(product.id).subscribe({
      next: (response) => {
        this.deletingProductId = null;
        this.alertService.success(
          'Producto eliminado', 
          `"${response.name}" ha sido eliminado exitosamente.`
        );
        this.loadProducts(); // Recargar la lista
      },
      error: (error) => {
        this.deletingProductId = null;
        console.error('Error eliminando producto:', error);
        this.alertService.error(
          'Error al eliminar producto', 
          error.message || 'Ha ocurrido un error inesperado. Intenta nuevamente.'
        );
      }
    });
  }

  /**
   * Obtiene el mensaje cuando no hay productos
   */
  getEmptyMessage(): string {
    if (this.searchControl.value) {
      return `No se encontraron productos con "${this.searchControl.value}"`;
    }
    if (this.statusFilter.value) {
      return `No hay productos con estado "${this.statusFilter.value}"`;
    }
    return 'No hay productos registrados';
  }
}