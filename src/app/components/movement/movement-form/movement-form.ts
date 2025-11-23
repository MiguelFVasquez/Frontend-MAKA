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


    // cargar productos desde store o service
  products: Array<any> = [];

  form = this.fb.group({
    productId: [null, [Validators.required]],
    amount: [1, [Validators.required, Validators.min(1)]]
  });

  typeLabel = 'Registrar';

  ngOnInit() {
    // Determinear IN/OUT por la ruta: /movements/in o /movements/out
    const url = this.route.snapshot.url.map(s => s.toString()).join('/');
    this.typeLabel = url.includes('in') ? 'Registrar Entrada' : 'Registrar Salida';
    // cargar products
  }

  submit() {
    if (this.form.invalid) return;
    const dto = this.form.value;
    // Aquí llamas movementService.newMovement(dto, 'IN'|'OUT') según la ruta
  }
}
