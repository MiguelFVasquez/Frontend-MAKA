import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewMovementDTO } from '../models/Movement/NewMovementDTO';
import { ApiMovementResponse, MovementResponse } from '../models/Movement/MovementRespone';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/movement';

  /**
   * Obtiene todos los movimientos
   */
  getAll(): Observable<MovementResponse[]> {
    return this.http
      .get<ApiMovementResponse>(`${this.apiUrl}/getAll`)
      .pipe(map(response => response.respuesta));
  }

  /**
   * Crea un nuevo movimiento
   */
  create(movementData: NewMovementDTO): Observable<MovementResponse> {
    return this.http
      .post<ApiMovementResponse>(`${this.apiUrl}/create`, movementData)
      .pipe(map(response => response.respuesta[0]));
  }
}