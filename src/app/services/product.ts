import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, map } from 'rxjs';
import { ProductResponse } from '../models/Product/ProductResponse';
import { NewProductDTO } from '../models/Product/NewProductDTO';
import { UpdateProductDTO } from '../models/Product/UpdateProductDTO';


interface ApiResponse<T> {
  error: boolean;
  respuesta: T;
}

@Injectable({
  providedIn: 'root',
})
export class Product {
  private apiUrl  = 'http://localhost:8080/api/products'; 

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos
   */
  getAll(): Observable<ProductResponse[]> {
    return this.http.get<ApiResponse<ProductResponse[]>>(`${this.apiUrl}/getAll`)
      .pipe(
        map(response => response.respuesta)
      );
  }

  /**
   * Obtiene productos filtrados por estado
   */
  getByStatus(status: 'ACTIVO' | 'INACTIVO' | 'REPOSICION'): Observable<ProductResponse[]> {
    return this.http.get<ApiResponse<ProductResponse[]>>(`${this.apiUrl}/getByStatus/${status}`)
      .pipe(
        map(response => response.respuesta)
      );
  }
   // Método adicional que podrías necesitar después
  getProductById(id: number): Observable<ProductResponse> {
    return this.http
      .get<ApiResponse<ProductResponse>>(`${this.apiUrl}/getById/${id}`)
      .pipe(map(response => response.respuesta));
  }

  /**
   * Método para crear un nuevo producto 
   * @param productData 
   * @returns 
   */
  createProduct(productData: NewProductDTO): Observable<ProductResponse> {
    return this.http
      .post<ApiResponse<ProductResponse>>(`${this.apiUrl}/create`, productData)
      .pipe(map(response => response.respuesta));
  }

  /**
   * Método para actualizar un producto existente
   * @param id 
   * @param productData 
   * @returns 
   */
   updateProduct(productData: UpdateProductDTO): Observable<ProductResponse> {
    return this.http
      .put<ApiResponse<ProductResponse>>(`${this.apiUrl}/update`, productData)
      .pipe(map(response => response.respuesta));
  }


  /**
   * Busca productos por nombre o referencia (filtrado local)
   */
  searchProducts(products: ProductResponse[], searchTerm: string): ProductResponse[] {
    if (!searchTerm.trim()) {
      return products;
    }

    const term = searchTerm.toLowerCase().trim();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      (product.reference?.toLowerCase().includes(term) || false) ||
      (product.description?.toLowerCase().includes(term) || false)
    );
  }
}
