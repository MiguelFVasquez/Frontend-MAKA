import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ProductResponse } from '../../../models/Product/ProductResponse';


@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  products: ProductResponse[] = [];
  q = new FormControl('');
}
