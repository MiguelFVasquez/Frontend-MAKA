import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    stock: [0, [Validators.min(0)]],
    reference: [''],
    salePrice: [0, [Validators.min(0)]],
    buyPrice: [0, [Validators.min(0)]],
    stockMinimo: [0, [Validators.min(0)]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // cargar producto para edición -> productService.getById(id) ...
    }
  }

  submit() {
    if (this.form.invalid) return;
    const payload = this.form.value;
    // llamar servicio: productService.create(payload)
    // this.router.navigate(['/products'])
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
