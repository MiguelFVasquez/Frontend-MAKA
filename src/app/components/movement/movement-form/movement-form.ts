import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movement-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.css',
})
export class MovementForm {
   private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  movementType: 'IN' | 'OUT' = 'IN';
  typeLabel = 'Registrar Movimiento';
  products: Array<any> = [];
  selectedProduct: any = null;

  form = this.fb.group({
    productId: [null, [Validators.required]],
    amount: [1, [Validators.required, Validators.min(1)]],
    notes: ['']
  });

  ngOnInit() {
    // Determinar tipo de movimiento por la ruta
    const url = this.route.snapshot.url.map(s => s.toString()).join('/');
    this.movementType = url.includes('in') ? 'IN' : 'OUT';
    this.typeLabel = this.movementType === 'IN' 
      ? 'Registrar Entrada' 
      : 'Registrar Salida';

    // TODO: Cargar productos desde el servicio
    // this.productService.getAll().subscribe(products => {
    //   this.products = products;
    // });

    // Escuchar cambios en el producto seleccionado
    this.form.get('productId')?.valueChanges.subscribe(productId => {
      this.selectedProduct = this.products.find(p => p.id === productId);
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
    if (this.form.invalid) return;

    const dto = {
      ...this.form.value,
      type: this.movementType
    };

    // TODO: Implementar llamada al servicio
    // this.movementService.create(dto).subscribe(...)
    
    console.log('Movement:', dto);
    this.router.navigate(['/movements']);
  }

  cancel() {
    this.router.navigate(['/movements']);
  }
}
