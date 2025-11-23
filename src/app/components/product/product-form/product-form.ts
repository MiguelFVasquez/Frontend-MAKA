import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductResponse } from '../../../models/Product/ProductResponse';
import { Product } from '../../../services/product';
import { NewProductDTO } from '../../../models/Product/NewProductDTO';
import { AlertService } from '../../../services/alert-service';
import { UpdateProductDTO } from '../../../models/Product/UpdateProductDTO';


@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit{
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(Product);
  private alertService = inject(AlertService); 


  form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    stock: [0, [Validators.min(1)]],
    reference: [''],
    salePrice: [0, [Validators.min(1)]],
    buyPrice: [0, [Validators.min(1)]],
    stockMinimo: [0, [Validators.min(1)]],
  });

  // Variables para manejar el modo de edición
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  currentProduct: any = null;
  
  // Método ngOnInit para cargar datos si es modo edición
  ngOnInit() {
   const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = parseInt(id);
      this.loadProductForEdit(this.productId);
    }
  }

  private loadProductForEdit(id: number) {
  this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.currentProduct = product;
        this.form.patchValue({
          name: product.name,
          description: product.description,
          stock: product.stock,
          reference: product.reference,
          salePrice: product.sale_price,
          buyPrice: product.buy_price,
          stockMinimo: product.stock_minimo
        });
        
        // En modo edición, deshabilitamos el campo stock
        this.form.get('stock')?.disable();
        this.form.get('stock')?.setValue(product.stock);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.alertService.error('Error', 'No se pudo cargar el producto');
        this.isLoading = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.markAllFieldsAsTouched();
      this.alertService.warning(
        'Formulario incompleto', 
        'Por favor completa todos los campos requeridos correctamente.'
      );
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.productId) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }
  
private createProduct() {
    const payload: NewProductDTO = {
      name: this.form.value.name!,
      description: this.form.value.description!,
      stock: this.form.value.stock!,
      reference: this.form.value.reference!,
      salePrice: this.form.value.salePrice!,
      buyPrice: this.form.value.buyPrice!,
      stockMinimo: this.form.value.stockMinimo!
    };

    this.productService.createProduct(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.success(
          'Producto creado', 
          `"${response.name}" ha sido creado exitosamente.`
        );
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating product:', error);
        this.alertService.error(
          'Error al crear producto', 
          error.message || 'Ha ocurrido un error inesperado. Intenta nuevamente.'
        );
      }
    });
  }

  private updateProduct() {
    const payload: UpdateProductDTO = {
      idProduct: this.productId!,
      newName: this.form.value.name!,
      newDescription: this.form.value.description!,
      newSalePrice: this.form.value.salePrice!,
      newBuyPrice: this.form.value.buyPrice!,
      newStockMinimo: this.form.value.stockMinimo!
    };

    this.productService.updateProduct(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alertService.success(
          'Producto actualizado', 
          `"${response.name}" ha sido actualizado exitosamente.`
        );
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error updating product:', error);
        this.alertService.error(
          'Error al actualizar producto', 
          error.message || 'Ha ocurrido un error inesperado. Intenta nuevamente.'
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
    this.router.navigate(['/products']);
  }
}
